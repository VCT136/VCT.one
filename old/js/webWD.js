let gameState = "ingame";
let world = {};
let camera = {
	x : 0,
	y : 0,
	zoom : 50,
	moved: false
};
let selectedPlace = [false, 0];
let onScreenPlaces = [];
let showSidebarMenu = false;

//disable right click context menu
window.addEventListener("contextmenu", function(e){
	e.preventDefault();
});

function generateWorld(size, centerPointCount) {
	world = {
		places: [],
		width: size,
		height: size
	};
	let centerPoints = {
		terrain: {
			points: [],
			possibleValues: ["lnd", "wtr"]
		}
	};
	//create center points
	for (category in centerPoints) {
		for (let i = 0; i < centerPointCount; i++) {
			centerPoints[category].points.push({
				x: random(0, world.width),
				y: random(0, world.height),
				value: random(centerPoints[category].possibleValues)
			});
		}
	}
	console.log(centerPoints);
	//generate places
	for (let i = 0; i < world.width * world.height; i++) {
		let x = random(i, i + 1) % world.width;
		let y = random(1) + Math.floor(random(i, i + 1) / world.height);
		let terrain = "wtr";
		let closestCenterPoint = centerPoints.terrain.points[0];
		for (centerPoint of centerPoints.terrain.points) {
			if (
				Math.sqrt(Math.pow(centerPoint.x - x, 2) + Math.pow(centerPoint.y - y, 2)) <=
				Math.sqrt(Math.pow(closestCenterPoint.x - x, 2) + Math.pow(closestCenterPoint.y - y, 2))
			) {
				closestCenterPoint = centerPoint;
			}
		}
		terrain = closestCenterPoint.value;
		world.places.push({
			x: x,
			y: y,
			color: [
				random(50),
				random(50),
				random(50)
			],
			terrain: terrain,
			closestCenterPoint: centerPoints.terrain.points.indexOf(closestCenterPoint)
		});
	}
}

function getPlaceCornerCoordinates(i) {
	let coords = {
		tl: {x: 0, y: 0},
		tr: {x: 0, y: 0},
		bl: {x: 0, y: 0},
		br: {x: 0, y: 0}
	};
	//get top left
	if (i == 0) {
		coords.tl.x = camera.zoom * camera.x;
		coords.tl.y = camera.zoom * camera.y;
	}
	else if (i < world.width) {
		coords.tl.x = camera.zoom * (camera.x + world.places[i].x + 0.5 * (world.places[i - 1].x - world.places[i].x));
		coords.tl.y = camera.zoom * camera.y;
	}
	else if (i % world.width == 0) {
		coords.tl.x = camera.zoom * camera.x;
		coords.tl.y = camera.zoom * (camera.y + world.places[i].y + 0.5 * (world.places[i - world.width].y - world.places[i].y));
	}
	else {
		coords.tl.x = camera.zoom * (camera.x + (
			(world.places[i].x + world.places[i - 1].x +
			world.places[i - world.width].x + world.places[i - world.width - 1].x) / 4
		));
		coords.tl.y = camera.zoom * (camera.y + (
			(world.places[i].y + world.places[i - 1].y +
			world.places[i - world.width].y + world.places[i - world.width - 1].y) / 4
		));
	}
	//get top right
	if (i == world.width - 1) {
		coords.tr.x = camera.zoom * (camera.x + world.width);
		coords.tr.y = camera.zoom * camera.y;
	}
	else if (i < world.width) {
		coords.tr.x = camera.zoom * (camera.x + world.places[i].x + 0.5 * (world.places[i + 1].x - world.places[i].x));
		coords.tr.y = camera.zoom * camera.y;
	}
	else if (i % world.width == world.width - 1) {
		coords.tr.x = camera.zoom * (camera.x + world.width);
		coords.tr.y = camera.zoom * (camera.y + world.places[i].y + 0.5 * (world.places[i - world.width].y - world.places[i].y));
	}
	else {
		coords.tr.x = camera.zoom * (camera.x + (
			(world.places[i].x + world.places[i + 1].x +
			world.places[i - world.width].x + world.places[i - world.width + 1].x) / 4
		));
		coords.tr.y = camera.zoom * (camera.y + (
			(world.places[i].y + world.places[i + 1].y +
			world.places[i - world.width].y + world.places[i - world.width + 1].y) / 4
		));
	}
	//get bottom left
	if (i == (world.height - 1) * world.width) {
		coords.bl.x = camera.zoom * camera.x;
		coords.bl.y = camera.zoom * (camera.y + world.height);
	}
	else if (i >= (world.height - 1) * world.width) {
		coords.bl.x = camera.zoom * (camera.x + world.places[i].x + 0.5 * (world.places[i - 1].x - world.places[i].x));
		coords.bl.y = camera.zoom * (camera.y + world.height);
	}
	else if (i % world.width == 0) {
		coords.bl.x = camera.zoom * camera.x;
		coords.bl.y = camera.zoom * (camera.y + world.places[i].y + 0.5 * (world.places[i + world.width].y - world.places[i].y));
	}
	else {
		coords.bl.x = camera.zoom * (camera.x + (
			(world.places[i].x + world.places[i - 1].x +
			world.places[i + world.width].x + world.places[i + world.width - 1].x) / 4
		));
		coords.bl.y = camera.zoom * (camera.y + (
			(world.places[i].y + world.places[i - 1].y +
			world.places[i + world.width].y + world.places[i + world.width - 1].y) / 4
		));
	}
	//get bottom right
	if (i == world.height * world.width - 1) {
		coords.br.x = camera.zoom * (camera.x + world.width);
		coords.br.y = camera.zoom * (camera.y + world.height);
	}
	else if (i >= (world.height - 1) * world.width) {
		coords.br.x = camera.zoom * (camera.x + world.places[i].x + 0.5 * (world.places[i + 1].x - world.places[i].x));
		coords.br.y = camera.zoom * (camera.y + world.height);
	}
	else if (i % world.width == world.width - 1) {
		coords.br.x = camera.zoom * (camera.x + world.width);
		coords.br.y = camera.zoom * (camera.y + world.places[i].y + 0.5 * (world.places[i + world.width].y - world.places[i].y));
	}
	else {
		coords.br.x = camera.zoom * (camera.x + (
			(world.places[i].x + world.places[i + 1].x +
			world.places[i + world.width].x + world.places[i + world.width + 1].x) / 4
		));
		coords.br.y = camera.zoom * (camera.y + (
			(world.places[i].y + world.places[i + 1].y +
			world.places[i + world.width].y + world.places[i + world.width + 1].y) / 4
		));
	}

	return coords;
}

function getOnScreenPlaces(places){
	let result = [];
	for (let i = 0; i < places.length; i++) {
		if (checkIfCoordsOnScreen(getPlaceCornerCoordinates(i))) {
			result.push(i);
		}
	}
	return result;
}

//check if all place coordinates are on screen
function checkIfCoordsOnScreen(coords) {
	if (
		(coords.tr.x >= 0 || coords.br.x >= 0) &&
		(coords.tl.x <= windowWidth || coords.bl.x <= windowWidth) &&
		(coords.bl.y >= 0 || coords.br.y >= 0) &&
		(coords.tl.y <= windowHeight || coords.tr.y <= windowHeight)
	) {
		return true;
	}
	else {
		return false;
	}
}

//thanks to Nathan for this one
function solveLinearCoordinatesFormula(point1, point2, isX) {
	let slope = isX ?
		(point1.y - point2.y) / (point1.x - point2.x) :
		(point1.x - point2.x) / (point1.y - point2.y)
	;

    //initial is where the slope intersects with the y axis
	let initial = isX ?
		point1.y - (slope * point1.x) : 
		point1.x - (slope * point1.y)
	;
	
	return {
		slope: slope,
		initial: initial
	};
}

//checks if myCoord (x, y) is inbetween the four coordinates coords
function checkIfCoordinateInbetweenTheseFour(myCoord, coords) {
	
	//get top border at x
	let magicSolveObject = solveLinearCoordinatesFormula(coords.tl, coords.tr, true);
	let topBorderAtX = magicSolveObject.initial + (magicSolveObject.slope * myCoord.x);

	//get bottom border at x
	magicSolveObject = solveLinearCoordinatesFormula(coords.bl, coords.br, true);
	let bottomBorderAtX = magicSolveObject.initial + (magicSolveObject.slope * myCoord.x);

	//if in between check for x axis
	if (myCoord.y > topBorderAtX && myCoord.y < bottomBorderAtX) {
		//get left border at y
		magicSolveObject = solveLinearCoordinatesFormula(coords.bl, coords.tl, false);
		let leftBorderAtY = magicSolveObject.initial + (magicSolveObject.slope * myCoord.y);

		//get right border at y
		magicSolveObject = solveLinearCoordinatesFormula(coords.tr, coords.br, false);
		let rightBorderAtY = magicSolveObject.initial + (magicSolveObject.slope * myCoord.y);

		//check if myCoord is in between
		if (myCoord.x < rightBorderAtY && myCoord.x > leftBorderAtY) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

function drawPlace(i) { //render the place with identifier i
	//get corner coordinates
	let coords = getPlaceCornerCoordinates(i);
	
	if (checkIfCoordsOnScreen(coords) == true) {
		//set color for tile
		let tileColor = [0, 0, 0];
		if (world.places[i].terrain == "wtr"){
			tileColor = [0, 0, 175];
		}
		else {
			tileColor = [25, 205, 0];
		}
		fill(color(tileColor[0] + world.places[i].color[0], tileColor[1] + world.places[i].color[1], tileColor[2] + world.places[i].color[2]));
		if (selectedPlace[0] && selectedPlace[1] == i) {
			stroke(color(255, 255, 255));
		}
		else {
			stroke(color(tileColor[0] + world.places[i].color[0], tileColor[1] + world.places[i].color[1], tileColor[2] + world.places[i].color[2]));
		}
		//draw shape of tile
		beginShape();
		vertex(coords.tl.x, coords.tl.y);
		vertex(coords.tr.x, coords.tr.y);
		vertex(coords.br.x, coords.br.y);
		vertex(coords.bl.x, coords.bl.y);
		endShape(CLOSE);

		fill(color(255));
		//FOR PRINTING TEXT AT TOP LEFT CORNER FOR DEBUGGING
		//text(world.places[i].closestCenterPoint, coords.tl.x, coords.tl.y);
	}
}

function drawPlaceCircle(i) {
	//set color for place
	if (world.places[i].terrain == "wtr"){
		tileColor = [0, 0, 125];
	}
	else {
		tileColor = [0, 150, 0];
	}
	fill(color(tileColor[0] + world.places[i].color[0], tileColor[1] + world.places[i].color[1], tileColor[2] + world.places[i].color[2]));
	stroke(color(tileColor[0] + world.places[i].color[0], tileColor[1] + world.places[i].color[1], tileColor[2] + world.places[i].color[2]));
	//draw place
	circle(
		camera.zoom * (camera.x + world.places[i].x),
		camera.zoom * (camera.y + world.places[i].y),
		0.2 * camera.zoom
	);
}

function drawSidebarMenu(yOffset = 0) {
	fill(color(255, 200));
	noStroke();
	if (windowWidth > 400) {
		rect(0, 0, 200, windowHeight);
	}
	else {
		rect(0, 0, windowWidth / 2, windowHeight);
	}
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	generateWorld(50, 100);
	onScreenPlaces = getOnScreenPlaces(world.places);
}

function mouseClicked() {
	if (mouseButton == "left") {
		for (let i = 0; i < onScreenPlaces.length; i++) {
			if (checkIfCoordinateInbetweenTheseFour(
				{x: mouseX, y: mouseY},
				getPlaceCornerCoordinates(onScreenPlaces[i])
			) == true) {
				if (selectedPlace[0] && selectedPlace[1] == onScreenPlaces[i]) {
					selectedPlace[0] = false;
				}
				else {
					selectedPlace = [true, onScreenPlaces[i]];
					console.log(world.places[selectedPlace[1]]);
				}
				break;
			}
		}
	}
}

function keyPressed() {
	if (key == "r") {
		generateWorld(world.width, 30);
	}
}

function draw() {

	if (gameState == "ingame") {
		background(color(0, 0, 0));
		
		//draw every place
		for (let i = 0; i < onScreenPlaces.length; i++) {
			drawPlace(onScreenPlaces[i]);
		}
		
		//draw selection
		if (selectedPlace[0]) {
			drawPlace(selectedPlace[1]);
		}

		//draw sidebar
		if (showSidebarMenu) {
			drawSidebarMenu();
		}
		
		//move camera with mouse
		if (mouseIsPressed && mouseButton == "center") {
			if(Math.abs(movedX) + Math.abs(movedY) != 0) {
				camera.x += movedX / camera.zoom;
				camera.y += movedY / camera.zoom;
				camera.moved = true;
			}
		}
		if (camera.moved) {
			onScreenPlaces = getOnScreenPlaces(world.places);
			print("x: " + str(camera.x) + " | y: " + str(camera.y) + " | zoom: " + str(camera.zoom));
			camera.moved = false;
		}
	}
}

//enable window resizing
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	for (let i = 0; i < onScreenPlaces.length; i++) {
		drawPlace(onScreenPlaces[i]);
	}
}

//zoom with scroll wheel
function mouseWheel(e) {
	camera.zoom -= 0.02 * e.delta;
	if (camera.zoom < 10) {
		camera.zoom = 10;
	}
	else if (camera.zoom > 150) {
		camera.zoom = 150;
	}
	onScreenPlaces = getOnScreenPlaces(world.places);
}