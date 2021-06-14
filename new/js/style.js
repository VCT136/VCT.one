function adjust() {
    
    //introduction article
    
    //adjust image size to div height
    let divheight = $("article.introduction div").css("height");
    let imgdimensionsize = "calc(" + divheight + " + 3vmin)";
    $("article.introduction img").css("height", imgdimensionsize);
    $("article.introduction img").css("width", imgdimensionsize);

    //fit text box width to image size unless on phone
    if (!window.matchMedia("(max-width: 800px)").matches) {
        $("article.introduction").css("grid-template-columns", "calc(" +divheight + " + 4vmin) 1fr");
    }

    //role cards

    //make cards 1:0.6 if on phone
    $("div.role-cards article").css("height", 
        "calc(" + $("div.role-cards article").css("width") + " * 0.6)"
    );
    
}