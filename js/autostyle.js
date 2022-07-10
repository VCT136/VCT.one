// when document is ready
$(document).ready(function() 
{
    // load interaction script
    let interactionScript = document.createElement("script");
    interactionScript.type = "text/javascript";
    interactionScript.src = "/js/interaction.js";
    $("head").append(interactionScript);

    // run setup and adjust
    setup(adjust);

    //re-adjust on resize
    $(window).resize(adjust);
});

function setup(callback = function(){}) {

    // add " | VCT.one" to title
    if (!document.title.includes("VCT.one")) {
        document.title += " | VCT.one";
    }

    // add logo favicon
    $("head").append("<link rel=\"shortcut icon\" href=\"/res/VCT2022_iconShape.png\">")

    // enable Flickity plugin for slideshows
    $("div.slideshow").flickity({
        autoPlay: 6000,
        cellAlign: "left",
        contain: true,
        pageDots: false,
        pausePlayOnHover: true,
        wrapAround: true
    });

    // add header
    $("body").prepend("<div id=\"header\"/>");
    $("div#header").load("/header.html", () => {

        // add footer
        $("body").append("<div id=\"footer\"/>");
        $("div#footer").load("/footer.html", ()=> {

            //callback
            callback();
        });
    });
}

function adjust() {

    // adjust header space height
    $("div#header div.space").css("height", $("div#header header").outerHeight());

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