//load interaction script when document is ready
$(document).ready(function() 
{
    let interactionScript = document.createElement("script");
    interactionScript.type = "text/javascript";
    interactionScript.src = "/js/interaction.js";
    $("head").append(interactionScript);
});

//set up recurring elements missing from a page
function setup() {

    //contact button
    if ($("div#contact-button").length == 0) {
        $("body").append('<div id="contact-button"></div>');
        $("div#contact-button").load("/elements.html #contact-button");
        console.warn("Automatically added contact button. Add it to page html to increase site performance.");
    }

    //nav bar at the top
    if ($("nav").length == 0) {
        $("body").prepend("<nav></nav>");
        $("nav:first-child").load("/elements.html #nav");
        console.warn("Automatically added nav. Add it to page html to increase site performance.");
    }

    //footer
    if ($("footer").length == 0) {
        $("body").append('<div class="space"></div>');
        $("body").append("<footer></footer>");
        $("footer").load("/elements.html #footer");
        console.warn("Automatically added footer. Add it to page html to increase site performance.");
    }

    //window scroll function and contact button adjustment
    window.onscroll = function() {
        let upScrollY = ($("body").outerHeight() - window.scrollY - window.innerHeight);
        if (window.scrollY > $("footer").offset().top - window.innerHeight) {
            $("button.contact").html(`
                Contact Info<br>
                ↓
            `);
            $("button.contact").css({
                "right": "50%",
                "bottom": "calc(2vmin + " + ($("footer").outerHeight() - upScrollY) + "px)",
                "transform": "translateX(50%)"
            });
        }
        else {
            $("button.contact").html(`
                Contact
            `);
            $("button.contact").css({
                "right": "2vmin",
                "bottom": "2vmin",
                "transform": "translateX(0)"
            });
        }
    }

    //image "lightbox"
    let lightboxImageParent = null;
    $(".card img").click((event) => {
        //event.target is the clicked image
        if (
            $("html").css("overflow") == "visible"
        ) {
            
            //disable image size limit
            if ($(event.target).is("article.main-card img")) {
                $(event.target).css("max-height", "none");
            }
            if ($(event.target).is("ol.projects li div img")) {
                $(event.target).css("height", "auto");
            }

            //place image in center
            let distanceToCenterX = $(document).width() / 2 - $(event.target).offset().left - $(event.target).width() / 2;
            let distanceToCenterY = window.scrollY + $(window).height() / 2 - $(event.target).height() / 2 - $(event.target).offset().top;

            let lightboxedImageScale = 1;
            if ($(document).width() / $(event.target).width() < (0.8 * $(window).height()) / $(event.target).height()) {
                lightboxedImageScale = $(document).width() / $(event.target).width();
            }
            else {
                lightboxedImageScale = (0.8 * $(window).height()) / $(event.target).height();
            }
            
            $(event.target).css("transform", `translate3d(${distanceToCenterX}px, ${distanceToCenterY}px, 11px) scale(${lightboxedImageScale})`);

            //add background
            $(event.target).css("background-color", "#0000007f");
            $(event.target).css("box-shadow", "0 0 100vmax 30vmax #0000007f");

            //remove border
            $(event.target).css("border-style", "none");
            $(event.target).css("border-radius", "0");

            //disable scrolling
            $("html").css("overflow", "hidden");

            //set z-index of top-level parent to 11
            let topLevelParentIdentified = false;
            lightboxImageParent = $(event.target);
            let iterationCounter = 0;
            while (!topLevelParentIdentified) {
                if ($(lightboxImageParent).parent().is("body")) {
                    topLevelParentIdentified = true;
                }
                else if (iterationCounter == 999) {
                    console.log("Failed to find image's parent element which is a direct child of the document's body.");
                    break;
                }
                else {
                    lightboxImageParent = $(lightboxImageParent).parent();
                }
                iterationCounter++;
            }
            $(lightboxImageParent).css("z-index", "11");

        }
        //if the lightbox is already active, turn it off
        else if ($("html").css("overflow") == "hidden") {

            //re-enable image size limit if needed
            if ($(event.target).is("article.main-card img")) {
                $(event.target).css("max-height", "50vmin");
            }
            if ($(event.target).is("ol.projects li div img")) {
                $(event.target).css("height", "20vh");
            }

            //reset transform
            $(event.target).css("transform", "");
            
            //reset background
            $(event.target).css("background-color", "");
            $(event.target).css("box-shadow", "");

            //reset border
            $(event.target).css("border-style", "");
            $(event.target).css("border-radius", "");
            
            //re-enable scrolling
            $("html").css("overflow", "visible");
            
            //reset top level parent's z-index
            $(lightboxImageParent).css("z-index", "");
        }
    });

    //background info on me

    if ($("#background").length > 0 && $("#background-info").length == 0 && $("#background").html().length == 0) {
        $("#background").load("/elements.html #background-info");
        console.warn("Automatically added background info. Add it to page html to increase site performance.");
    }

    //skills lists

    if ($("#skills").length > 0 && $("#skills").children().length == 0) {
        $("#skills").empty();
        let url = window.location.href;
        if (url.includes("coordinator")) {
            $("#skills").load("/elements.html #team-coordinator-skills-list");
            console.warn("loaded skills list");
        }
        else if (url.includes("programmer")) {
            $("#skills").load("/elements.html #programmer-skills-list");
            console.warn("loaded skills list");
        }
        else if (url.includes("gamedesign")) {
            $("#skills").load("/elements.html #game-designer-skills-list");
            console.warn("loaded skills list");
        }
        else if (url.includes("visualdesign")) {
            $("#skills").load("/elements.html #visual-designer-skills-list");
            console.warn("loaded skills list");
        }
        else {
            $("#skills").load("/elements.html #full-skills-list", () => {
                $("#skills button").css("display", "none");
            });
            console.warn("loaded skills list");
        }
    }
}

//adjust to screen size
function adjust() {

    //body

    //adjust grid template to amount of contents
    $("body").css("grid-template-rows", "10vh repeat(" + ($("body > :not(script)").length - 3) + ", min-content) auto min-content");
    
    //introduction article
    
    //adjust image size to div height
    let divheight = $("article.introduction div").css("height");
    let imgdimensionsize = divheight;
    $("article.introduction img").css("height", imgdimensionsize);
    $("article.introduction img").css("width", imgdimensionsize);

    //fit text box width to image size unless on phone
    if (!window.matchMedia("(max-width: 800px)").matches) {
        $("article.introduction").css("grid-template-columns",  divheight + " 1fr");
    }

    //role cards

    //make cards 1:0.6
    $("div.role-cards article").css("height", 
        "calc(" + $("div.role-cards article").css("width") + " * 0.6)"
    );

    //role introduction

    //adjust horizontal padding to create white field
    let roleintrowidth = $("article.role-introduction").css("width");
    $("article.role-introduction").css("padding-left", "calc((100% - " + roleintrowidth + ") / 2)");
    $("article.role-introduction").css("padding-right", "calc((100% - " + roleintrowidth + ") / 2)");

    //id links

    $("a").on("click", function(event) {
        if ($(this).attr("href").substring(0, 1) == "#") {
            event.preventDefault();
            let linkOffset = $($(this).attr("href")).offset();
            //if a table of contents exists and it's not on a phone
            moveViewTo($(this).attr("href"));
        }
    });
}