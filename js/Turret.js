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