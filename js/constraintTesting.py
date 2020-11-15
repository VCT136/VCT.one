# These are the four coordinates around the given dot.
# Please be careful which coordinates you assign to
# the variables below, otherwise the algorithm might
# not work out. The following coordinates indicate
# the following points in the shape:
# (x1,y1) - the left-upper corner.
# (x2,y2) - the right-upper corner.
# (x3,y4) - the left-lower corner.
# (x4,y4) - the right-lower corner.
x1 = 2
x2 = 4
x3 = 1
x4 = 3
y1 = 5
y2 = 4
y3 = 3
y4 = 1

# Figure out the linear formula behind the coordinates
# This is generalisable to both x and y as swapping
# the variables transforms it into the other function.
# (e.g. y = 6 - x transforms to x = 6 - x)
def solveFormula(x1,x2,y1,y2):
	deltaX = x1 - x2
	deltaY = y1 - y2
	slope = deltaY / deltaX
	initial = y1 - (slope * x1)
	#print('initial y: ' + str(initialY) + 'slope ' + str(slope))
	return initial, slope

if __name__ == "__main__":
	randomX = 10
	randomY = 10
	
	# Check whether the given Y is within bounds.
	## Get the upper border coordinate.
	initialY, slopeX = solveFormula(x1,x2,y1,y2)
	upperBorderAtX = initialY + (slopeX * randomX) # we calculate at what point of x the upper border would be.
	
	## Get the lower border coordinate.
	initialY, slopeX = solveFormula(x3,x4,y3,y4)
	lowerBorderAtX = initialY + (slopeX * randomX) # we calculate at what point of x the lower border would be.
	
	#print('upper border x: ' + str(upperBorderAtX) + ' lower border x: ' + str(lowerBorderAtX))
	
	if (randomY < upperBorderAtX and randomY > lowerBorderAtX):
		# The given point is within the y-borders, we can go on calculating the x-borders.
		
		## Get the left border coordinate.
		initialX, slopeY = solveFormula(x3,x1,y3,y1)
		leftBorderAtY = initialX + (slopeY * randomY) # we calculate at what point of y the left border would be.
		
		## Get the right border coordinate.
		initialX, slopeY = solveFormula(x2,x4,y2,y4)
		rightBorderAtY = initialX + (slopeY * randomY) # we calculate at what point of y the left border would be.
		
		#print('upper border y: ' + str(leftBorderAtY) + ' lower border y: ' + str(rightBorderAtY))
		
		if (randomX < leftBorderAtY and randomX > rightBorderAtY):
			print('The point is within the borders.')
			exit()
	
	print('The point is outside the borders.')
	