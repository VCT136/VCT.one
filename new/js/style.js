//set up recurring elements by replacing placeholders
function setup() {

    $("body").prepend("<nav></nav>");
    $("body nav:first-child").load("/elements.html #nav");

    $("body").append('<div class="space"></div>');
    $("body").append("<footer></footer>");
    $("body footer").load("/elements.html #footer")

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
            if (
                $("#table-of-contents").length > 0 &&
                window.matchMedia("(min-width: 801px)").matches
            ) {
                window.scrollTo(linkOffset, linkOffset.top - $("nav").outerHeight(true) - $("#table-of-contents").outerHeight(true));
            }
            //otherwise
            else {
                window.scrollTo(linkOffset, linkOffset.top - $("nav").outerHeight(true));
            }
        }
    });
}