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

    //window scroll function
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