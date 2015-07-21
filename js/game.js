var i = 0;
	
function toRadians (angle)
{
  return angle * (Math.PI / 180);
}

function toDegrees (angle)
{
	return angle * (180 / Math.PI);
}
function threeSixtyFy(inAngle)
{
	var outAngle = inAngle
	if(outAngle < 0)
	{
		outAngle += 360;
	}
	while(outAngle > 360)
	{
		outAngle -= 360;
	}
	return outAngle;
}

//Get the window size
var winWidth = window.innerWidth -50;
var winHeight = window.innerHeight -200;
var winCenterX = winWidth / 2;
var winCenterY = winHeight / 2;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = winWidth;
canvas.height = winHeight;
document.body.appendChild(canvas);

// Background / border
ctx.strokeRect(0,0, winWidth, winHeight);

//Create turret object Turret(xPosition, yPosition, gunBaseRadius, gunTipRadius, gunWidthAngle, minimumAngAcceleration, maximumAngularAcceleration, shotsPerSecond, degreesError)
var turret = new Turret(winCenterX, winCenterY, 20, 30, 20, 0, 100, 10, 1.5);

// Set up moving target MovingTarget(startingX, startingY, minimumX, minimumY, maximumX, maximumY, dotRadius, bounceEffeciency, acceleration, maximumSpeed)
var targetDrone = new MovingTarget(winCenterX, winCenterY / 2, 0, 0, winWidth, winHeight, 5, 1, 200, 300);

// Set the moving target as the turret's target
turret.setTarget(targetDrone);

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



// Reset the game
 var engage = function (form)
 {
	 turret.setMaxAcceleration(eval(form.turAcc.value));
	 turret.setDegreeError(eval(form.turErr.value));
	 turret.setRoF(eval(form.turRoF.value));
	 targetDrone.setMaxSpeed(eval(form.tarSpe.value));
	 targetDrone.setMaxAcceleration(eval(form.tarAcc.value));
 }

// Update game objects
var update = function (timePassed) {
	
	if (38 in keysDown) { // Player holding up
		targetDrone.thrustUp(timePassed);
	}
	if (40 in keysDown) { // Player holding down
		targetDrone.thrustDown(timePassed);
	}
	if (37 in keysDown) { // Player holding left
		targetDrone.thrustLeft(timePassed);
	}
	if (39 in keysDown) { // Player holding right
		targetDrone.thrustRight(timePassed);
	}
	if (88 in keysDown) { // Player holding x
		targetDrone.thrustStop(timePassed);
	}
	if (90 in keysDown) { // Player holding z
		
	}
	else
	{
	// Aim the turret
	turret.maxAccelAim();
	
	//Update the target and turret
	targetDrone.updatePos(timePassed);
	turret.updateTurret(timePassed);
	}
};

// Draw everything
var render = function () {
	
	
	//Clear the screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Background / border
	ctx.strokeRect(0,0, winWidth, winHeight);
	
 	// Draw turret
	var turretPath = turret.drawTurret();
	ctx.stroke(turretPath);
	turretPath.closePath();
	
	// Draw moving target
	ctx.beginPath();
	ctx.arc(targetDrone.getXPos(),targetDrone.getYPos(),targetDrone.getRadius(),0,2*Math.PI);
	ctx.fill();

	//debug text
	ctx.strokeText("Target speed: " + parseFloat(Math.round(targetDrone.getSpeed() * 100) / 100).toFixed(1), 20, i+=20);
	ctx.strokeText("Movement Angle: " + parseFloat(Math.round(targetDrone.getVelocityAngle()	* 100) / 100).toFixed(1), 20, i+=20);
	
	ctx.strokeText("Relative angle: " + parseFloat(Math.round(
	turret.getRelativeVelocityAngle()
	* 100) / 100).toFixed(1), 20, i+=20);
	
	ctx.strokeText("Angular velocity: " + parseFloat(Math.round(
	turret.getRelativeAngularVelocity()
	* 100) / 100).toFixed(1), 20, i+=20);
	
	ctx.strokeText("Distance to target: " + parseFloat(Math.round(
	turret.getDistanceToTarget()
	* 100) / 100).toFixed(1), 20, i+=20);
	
	ctx.strokeText("Turret angle: " + parseFloat(Math.round(turret.getAngle() * 100) / 100).toFixed(1), 20, i+=20);
	ctx.strokeText("Desired angle: " + parseFloat(Math.round(turret.getDesiredAngle() * 100) / 100).toFixed(1), 20, i+=20);

};

// The main game loop
var main = function () {
	i=0;
	
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
main();