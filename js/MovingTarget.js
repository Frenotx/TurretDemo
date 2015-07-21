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