console.log("Hey! Don't mess with my website, console-opener-person! \nJk, go ahead and have fun. : )");

function changeRandomTitle() {
	let titles = [
		"All I do (or not):",
		"Check that out!",
		"Click me!",
		"Discover stuff!",
		"Games and More",
		"Inspired",
		"Online Portfolio",
		"Question Everything!",
		"Quite the Website.",
		"Thanks for visiting!",
		"The Title"
	];
	let randomTitleId = Math.floor(Math.random() * titles.length);
	while (document.getElementById("randomTitle").innerHTML == titles[randomTitleId]) {
		randomTitleId = Math.floor(Math.random() * titles.length);
	}
	document.getElementById("randomTitle").innerHTML = titles[randomTitleId];
}

changeRandomTitle();