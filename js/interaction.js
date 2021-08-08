//skills lists

function fullSkillsList() {

    $("#skills").empty();
    $("#skills").load("/elements.html #full-skills-list");

}

function specializeSkillsList() {

    $("#skills").empty();
    let url = window.location.href;
    if (url.includes("coordinator")) {
        $("#skills").load("/elements.html #team-coordinator-skills-list");
    }
    else if (url.includes("programmer")) {
        $("#skills").load("/elements.html #programmer-skills-list");
    }
    else if (url.includes("programmer")) {
        $("#skills").load("/elements.html #programmer-skills-list");
    }
    else if (url.includes("programmer")) {
        $("#skills").load("/elements.html #programmer-skills-list");
    }
    else {
        $("#skills").load("/elements.html #full-skills-list", () => {
            $("#skills button").css("display", "none");
            $("#skills").append("<p>Oops! It appears that something went wrong trying to read this url, so I'll just leave the full skills list here for now.</p>");
        });
    }

}