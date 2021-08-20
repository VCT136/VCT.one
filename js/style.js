//load interaction script when document is ready
$(document).ready(function() 
{
    let interactionScript = document.createElement("script");
    interactionScript.type = "text/javascript";
    interactionScript.src = "/js/interaction.js";
    $("head").append(interactionScript);
});

//set up recurring elements by replacing placeholders
function setup() {

    //contact button
    $("body").prepend('<div id="contact-button"></div>');
    $("div#contact-button").load("/elements.html #contact-button");

    //nav bar at the top
    $("body").prepend("<nav></nav>");
    $("nav:first-child").load("/elements.html #nav");

    //footer
    $("body").append('<div class="space"></div>');
    $("body").append("<footer></footer>");
    $("footer").load("/elements.html #footer");

    //window scroll function
    window.onscroll = function() {
        if (window.scrollY > $("footer").offset().top - window.innerHeight) {
            $("button.contact").css("display", "none");
        }
        else {
            $("button.contact").css("display", "block");
        }
    }

    //background info on me

    $("#background").load("/elements.html #background-info");

    //skills lists

    $("#skills").empty();
    let url = window.location.href;
    if (url.includes("coordinator")) {
        $("#skills").load("/elements.html #team-coordinator-skills-list");
    }
    else if (url.includes("programmer")) {
        $("#skills").load("/elements.html #programmer-skills-list");
    }
    else if (url.includes("gamedesign")) {
        $("#skills").load("/elements.html #game-designer-skills-list");
    }
    else if (url.includes("visualdesign")) {
        $("#skills").load("/elements.html #visual-designer-skills-list");
    }
    else {
        $("#skills").load("/elements.html #full-skills-list", () => {
            $("#skills button").css("display", "none");
        });
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