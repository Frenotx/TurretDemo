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


function MovingTarget(startingX, startingY, minimumX, minimumY, maximumX, maximumY, dotRadius, bounceEffeciency, acceleration, maximumSpeed)
{
	var xPos = startingX;
	var yPos = startingY;
	var minX = minimumX;
	var minY = minimumY;
	var maxX = maximumX;
	var maxY = maximumY;
	var xSpeed = 0;
	var ySpeed = 0;
	var accel = acceleration;
	var bounceCoef = bounceEffeciency;
	var maxSpeed = maximumSpeed;
	var radius = dotRadius;
	
	//Getters
	this.getXPos = function()
	{
		return xPos;
	}
	this.getYPos = function()
	{
		return yPos;
	}
	this.getXSpeed = function()
	{
		return xSpeed;
	}
	this.getYSpeed = function()
	{
		return ySpeed;
	}
	this.getAcceleration = function()
	{
		return accel;
	}
	this.getBounceCoefficient = function()
	{
		return bounceCoef;
	}
	this.getMaxSpeed = function()
	{
		return maxSpeed;
	}
	this.getRadius = function()
	{
		return radius;
	}
	
	//Setters
	this.setXSpeed = function(newXSpeed)
	{
		xSpeed = newXSpeed;
	}
	this.setYSpeed = function(newYSpeed)
	{
		ySpeed = newYSpeed;
	}
	this.setMaxAcceleration = function(newMax)
	{
		accel = newMax;
	}
	this.setMaxSpeed = function(newMax)
	{
		maxSpeed = newMax;
	}
	
	//Logic
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

	this.getSpeed = function()
	{
		if(xSpeed == 0 && ySpeed == 0)
		{
			return 0;
		}
		else
		{
			return Math.sqrt(Math.pow(xSpeed,2) + Math.pow(ySpeed,2));
		}
	}
	
	this.limitSpeed = function()
	{	//Check if it's too fast
		var speedLimiter = maxSpeed / this.getSpeed();
		if(speedLimiter < 1)
		{
			//find percent overage
			xSpeed = xSpeed * speedLimiter;
			ySpeed = ySpeed * speedLimiter;
		}
	}
	
	this.updatePos = function(timePassed)
	{
		this.limitSpeed();
		xPos += xSpeed * timePassed;
		yPos += ySpeed * timePassed;
		//Check for bounce
		if(xPos <= minX)
		{
			xPos = minX;
			xSpeed = xSpeed * -bounceCoef;
			ySpeed = ySpeed * bounceCoef;
		}
		if(xPos >= maxX)
		{
			xPos = maxX;
			xSpeed = xSpeed * -bounceCoef;
			ySpeed = ySpeed * bounceCoef;
		}
		if(yPos <= minY)
		{
			yPos = minY;
			ySpeed = ySpeed * -bounceCoef;
			xSpeed = xSpeed * bounceCoef;
		}
		if(yPos >= maxY)
		{
			yPos = maxY;
			ySpeed = ySpeed * -bounceCoef;
			xSpeed = xSpeed * bounceCoef;
		}
	}
	
	this.getVelocityAngle = function()
	{
		var moveAngle = toDegrees(Math.atan(ySpeed / xSpeed));
		if(xSpeed < 0)
		{
			moveAngle += 180;
		}
		return threeSixtyFy(moveAngle);
	}
	
	//Thrust
	this.thrustUp = function(timePassed)
	{
		ySpeed -= accel * timePassed;
		// this.limitSpeed();
		ctx.strokeText("out", 20, 240);
	}
	this.thrustDown = function(timePassed)
	{
		ySpeed += accel * timePassed;
		// this.limitSpeed();
	}
	this.thrustLeft = function(timePassed)
	{
		xSpeed -= accel * timePassed;
		// this.limitSpeed();
	}
	this.thrustRight = function(timePassed)
	{
		xSpeed += accel * timePassed;
		// this.limitSpeed();
	}
	this.thrustStop = function(timePassed)
	{
		if(this.getSpeed() <= accel * timePassed)
		{
			xSpeed = 0;
			ySpeed = 0;
		}
		else
		{
			var speedLimiter = (this.getSpeed() - (accel * timePassed)) / this.getSpeed();
			if(speedLimiter < 1)
			{
				//find percent overage
				xSpeed = xSpeed * speedLimiter;
				ySpeed = ySpeed * speedLimiter;
			}
		}
		// this.limitSpeed();
	}
}

//Create turret object
function Turret(xPosition, yPosition, gunBaseRadius, gunTipRadius, gunWidthAngle, minimumAngAcceleration, maximumAngularAcceleration, shotsPerSecond, degreesError)
{
	var xPos = xPosition;
	var yPos = yPosition;
	var angle = 0;
	var angVelocity = 0;
	var minAngAcceleration = minimumAngAcceleration;
	var maxAngAcceleration = maximumAngularAcceleration;
	var curAngAccel = minAngAcceleration;
	var baseRadius = gunBaseRadius;
	var gunRadius = gunTipRadius;
	var gunWidth = gunWidthAngle;
	var target = MovingTarget(0, 0, 0, 0, 0, 0, 0, 1, 200, 200);
	var targetLastAngVelocity = 0;
	var targetAngAcceleration = 0;
	var rOf = shotsPerSecond;
	var secondsSinceLastShot = 0;
	var degreesOff = degreesError;
	
	//Getters
	this.getTarget = function()
	{
		return target;
	}
	this.getGunWidthAngle = function()
	{
		return gunWidth;
	}
	this.getGunTipRadius = function()
	{
		return gunRadius;
	}
	this.getBaseRadius = function()
	{
		return baseRadius;
	}
	this.getMaxAngAcceleration = function()
	{
		return maxAngAcceleration;
	}
	this.getMinAngAcceleration = function()
	{
		return minAngAcceleration;
	}
	this.getAngVelocity = function()
	{
		return angVelocity;
	}
	this.getXPosition = function()
	{
		return xPos;
	}
	this.getYPosition = function()
	{
		return yPos;
	}
	this.getAngle = function()
	{
		return angle;
	}
	
	//Setters
	this.setRoF = function(newRoF)
	{
		rOf = newRoF;
	}
	this.setMaxAcceleration = function(newMax)
	{
		maxAngAcceleration = newMax;
	}
	this.setDegreeError = function(newErr)
	{
		degreesOff = newErr;
	}
	this.setTarget = function(newTarget)
	{
		target = newTarget;
		targetLastAngVelocity = this.getRelativeAngularVelocity();
		targetAngAcceleration = 0;
	}
	this.setPosition = function(newX, newY)
	{
		xPos = newX;
		yPos = newY;
	}
	this.setAngle = function(toAngle)
	{
		angle = threeSixtyFy(toAngle);
	}
	
	//Drawing
	this.drawTurret = function()
	{		
		// Draw turret gun
		var turretPath = new Path2D();
		//Find and draw the gun start point (cos and sin are for converting polar to rectangular)
		var gunStartX = xPos + baseRadius * Math.cos(toRadians(angle + gunWidth));
		var gunStartY = yPos + baseRadius * Math.sin(toRadians(angle + gunWidth));
		turretPath.moveTo(gunStartX ,gunStartY);
		//Find and draw the gun tip
		var gunTipX = xPos + gunRadius * Math.cos(toRadians(angle));
		var gunTipY = yPos + gunRadius * Math.sin(toRadians(angle));
		turretPath.lineTo(gunTipX ,gunTipY);
		//draw the beam
		if(secondsSinceLastShot >= 1 / rOf -.1)
		{
			var beamTipX = gunTipX + (this.getDistanceToTarget() - gunRadius) * Math.cos(toRadians(angle));
			var beamTipY = gunTipY + (this.getDistanceToTarget() - gunRadius) * Math.sin(toRadians(angle));
			turretPath.lineTo(beamTipX ,beamTipY);
			turretPath.moveTo(gunTipX ,gunTipY);
			if(secondsSinceLastShot >= 1 / rOf)
			{
				secondsSinceLastShot = 0;
			}
		}
		
		//Find and draw the gun end point
		var gunEndX = xPos + baseRadius * Math.cos(toRadians(angle - gunWidth));
		var gunEndY =  yPos + baseRadius * Math.sin(toRadians(angle - gunWidth));
		turretPath.lineTo(gunEndX, gunEndY);
		
		//Draw the base
		turretPath.arc(xPos, yPos, baseRadius ,toRadians(angle - gunWidth), toRadians(angle + gunWidth), true);
		
		return turretPath;
	}
	
	//Logic
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
	
	this.updateTurret = function(timePassed)
	{
		angVelocity += curAngAccel * timePassed;
		this.setAngle(angle += angVelocity * timePassed);
		var velocityDiff = this.getRelativeAngularVelocity() - targetLastAngVelocity;
		targetAngAcceleration = velocityDiff / timePassed;
		targetLastAngVelocity = this.getRelativeAngularVelocity();
		secondsSinceLastShot += timePassed;
	}
	
	this.maxAccelAim = function()
	{
		var desiredAngle = this.getDesiredAngle();
		var angleDelta = desiredAngle - angle;
		if(angleDelta < 0)
		{
			angleDelta += 360;
		}
		if(angleDelta > 180)
		{
			angleDelta -= 360;
		}
		angleDelta = angleDelta + (degreesOff * angleDelta / Math.abs(angleDelta)); // Add in inaccuracy for characteristic "wiggle"
		
		ctx.strokeText("Angle delta: " + angleDelta, 20, 380);
		var targetAngVelocity = this.getRelativeAngularVelocity();
		if(targetAngAcceleration / Math.abs(targetAngAcceleration) * targetAngVelocity / Math.abs(targetAngVelocity) >= 0)//Check if the target is speeding up
		{
			ctx.strokeText("Target Speeding up", 20, 580);
			targetAngVelocity += targetAngAcceleration * .25; // Target is speeding up. Add a second of acceleration
		} 
		var angVelocityDelta = -angVelocity + targetAngVelocity; // angular velocity delta.  Positive means closing on target, negative means opening
		
		ctx.strokeText("targetAngVelocity: " + targetAngVelocity, 20, 400);
		ctx.strokeText("angVelocity: " + angVelocity, 20, 420);
		ctx.strokeText("AngVel Delta: " + angVelocityDelta, 20, 440);
		
		var movingToTarget = ((angleDelta * angVelocity) > 1);
		ctx.strokeText("movingToTarget: " + movingToTarget , 20, 460);
		
		var closing = true;
		if((targetAngVelocity / Math.abs(targetAngVelocity)) * (angVelocity / Math.abs(angVelocity)) <= 0) // moving opposite directions?
		{
			if((angleDelta * angVelocity) > 1) // moving towards each other?
			{
				closing = true;
			}
			else // moving away from each other
			{
				closing = false;
			}
		}
		else if((angleDelta / Math.abs(angleDelta)) * (angVelocityDelta / Math.abs(angVelocityDelta)) <= 0) //Moving in same direction. Still behind?
		{
			closing = true;
		}
		else // gone too far
		{
			closing = false;
		}
		if(closing) //closing on target
		{
			ctx.strokeText("Closing", 20, 480);
			var minRequiredSlowTime = Math.abs(angVelocityDelta / maxAngAcceleration); //time it takes to match target velocity in seconds
			ctx.strokeText("Req. slow time: " + minRequiredSlowTime, 20, 500);
			var secondsToTarget = Math.abs(angleDelta / angVelocityDelta); //time it takes to reach desired angle in seconds. Negative value means the target is opening
			
			if(secondsToTarget <= minRequiredSlowTime) //check if the time to target is less (or equal) to the time it will take to match the target speed
			{
				ctx.strokeText("Slowing Down", 20, 540);
				curAngAccel = (-angleDelta/Math.abs(angleDelta)) * maxAngAcceleration; // Closing too fast. Accelerate away from the target
			}
			else
			{
				ctx.strokeText("Speeding Up", 20, 540);
				curAngAccel = (angleDelta/Math.abs(angleDelta)) * maxAngAcceleration;// Can close faster. Accelerate towards target
			}
		}
		else //target opening
		{			
			curAngAccel = (angleDelta/Math.abs(angleDelta)) * maxAngAcceleration;// apply full acceleration in the correct direction
		}
		ctx.strokeText("AngAccel: " + targetAngAcceleration, 20, 560);
	}
	
	this.getDesiredAngle = function()
	{
		var desiredAngle = toDegrees(Math.atan((target.getYPos() - yPos) / (target.getXPos() - xPos)));
		if(target.getXPos() - xPos < 0)
		{
			desiredAngle += 180;
		}
		desiredAngle = threeSixtyFy(desiredAngle);
		return desiredAngle;
	}	
	
	this.getRelativeVelocityAngle = function()
	{
		return threeSixtyFy(this.getDesiredAngle() + threeSixtyFy(360 - target.getVelocityAngle()) - 180);
	}
	
	this.getRelativePerpVelocity = function()
	{
		if(target.getSpeed() == 0)
		{
			return 0;
		}
		else
		{
			return Math.cos(toRadians(this.getRelativeVelocityAngle() - 90)) * target.getSpeed();
		}
	}
	
	this.getRelativeAngularVelocity = function()
	{
		if(target.getSpeed() == 0)
		{
			return 0;
		}
		else
		{
			var perpVelocity = this.getRelativePerpVelocity();
			var distanceTo =  this.getDistanceToTarget();
			return toDegrees(Math.atan(perpVelocity/distanceTo));
		}
	}
	
	this.getDistanceToTarget = function()
	{
		return Math.sqrt(Math.pow(xPos - target.getXPos(), 2) + Math.pow(yPos - target.getYPos(), 2));
	}
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