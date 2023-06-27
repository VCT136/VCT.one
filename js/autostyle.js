// when document is ready
$(function() 
{
    // run setup and adjust
    setup(() => {
        adjust();
    });

    //re-adjust on resize
    $(window).resize(adjust);
});

function setup(callback = function(){}) {

    // add " | VCT.one" to title
    if (!document.title.includes("VCT.one")) {
        document.title += " | VCT.one";
    }

    // add logo favicon
    $("head").append(
        "<link rel=\"shortcut icon\" href=\"/res/vct_icon.png\">"
    );
    // add meta viewport tag
    $("head").append(
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
    );

    // add css
    $("head").append("<link id=\"style\" rel=\"stylesheet\" href=\"/css/vct.css\">");
    // wait for load
    $("head #style").on("load", () => {

        // add Flickity js
        $.getScript("/js/flickity.pkgd.min.js", (script, status, jqXhr) => {
            // add Flickity css
            $("head").append(
                "<link id=\"flickitycss\" rel=\"stylesheet\" href=\"/css/flickity.min.css\" media=\"screen\">"
            );
            // wait for load
            $("head #flickitycss").on("load", ()=>{

                // enable Flickity plugin for slideshows
                $("div.slideshow").flickity({
                    autoPlay: 6000,
                    cellAlign: "left",
                    contain: true,
                    imagesLoaded: true,
                    pageDots: true,
                    pausePlayOnHover: true,
                    setGallerySize: false,
                    wrapAround: true
                });
    
                // add header
                $("body").prepend("<div id=\"header\"/>");
                $("div#header").load("/header.html", () => {
    
                    // adjust links in case they go to current page
                    let headerNavLinks = $("header nav a");
                    let currentUrl = window.location.pathname;
                    if (currentUrl != "/") {
                        currentUrl = currentUrl.substring(currentUrl.indexOf("/"), currentUrl.lastIndexOf("/"));
                    }
                    headerNavLinks.each((index, element) => {
                        if (
                            currentUrl == $(element).attr("href")
                        ) {
                            $(element).attr("href", "#top");
                            $(element).css("color", "var(--grey-36)");
                            $(element).children().css("box-shadow", "0 0 16px var(--half-mahogany) inset");
                        }
                        // if it's the last element continue with the rest of the code
                        if (!--headerNavLinks.length) {
                            
                            // add footer
                            $("body").append("<div id=\"footer\"/>");
                            $("div#footer").load("/footer.html", ()=> {
    
                                // callback
                                callback();
                            });
                        }
                    });
                });
            });
        });
    });
}

function adjust() {

    // adjust header space height
    $("div#header div.space").css("height", $("div#header header").outerHeight());
    // adjust footer space height
    $("div#footer div.space").css("height", $("div#footer footer").outerHeight());
}