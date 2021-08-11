//scroll to an element and take nav and table of contents into account

function moveViewTo(targetElement) {
    let targetOffset = $(targetElement).offset();
    //if a table of contents exists and it's not on a phone
    if (
        $("#table-of-contents").length > 0 &&
        window.matchMedia("(min-width: 801px)").matches
    ) {
        window.scrollTo(targetOffset, targetOffset.top - $("nav").outerHeight(true) - $("#table-of-contents").outerHeight(true) - 10);
    }
    //otherwise
    else {
        window.scrollTo(targetOffset, targetOffset.top - $("nav").outerHeight(true) - 10);
    }
}

//skills lists

function fullSkillsList() {

    moveViewTo("#skills");
    setTimeout(() => {
        $("#skills").addClass("slide-out");
        $("#skills").on("animationend", () => {
            $("#skills").empty();
            $("#skills").load("/elements.html #full-skills-list");
            $("#skills").removeClass("slide-out");
            $("#skills").addClass("slide-in");
        });
    }, 500);
}

function specializeSkillsList() {

    moveViewTo("#skills");
    setTimeout(() => {
        $("#skills").addClass("slide-out");
        $("#skills").on("animationend", () => {
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
                    $("#skills").append("<p>Oops! It appears that something went wrong trying to read this url, so I'll just leave the full skills list here for now.</p>");
                });
            }
            $("#skills").removeClass("slide-out");
            $("#skills").addClass("slide-in");
        });
    }, 500);
}