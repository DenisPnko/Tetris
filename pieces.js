/*
 *  This file contains the piece object's structure and its functionality
 */

 function Piece(states)
 {
 	// Constructor
 	this.states = states;
 	this.state = 0;
 	this.posY = 0;
 	this.posX = 1 + Math.floor(Math.random() * (20 - states[this.state][0].length));

 	// Iterate over the piece coordinates and apply the supplied function
 	this.eachPoint = function(action) {

 		var iPosX = this.posX;
 		var iPosY = this.posY;

 		for(var r = 0, len = this.states[this.state].length; r < len; r++)
 		{
 			for(var c = 0, len2 = this.states[this.state][r].length; c < len2; c++)
 			{
 				action(iPosX, iPosY, this.states[this.state][r][c]);

 				iPosX += 1;
 			}

 			iPosX = this.posX;
 			iPosY += 1;
 		}
 	};

 	// Check if the piece occupies a valid position on the grid (no overlaps/out of boundary)
 	this.isValid = function() {

 		var result = true;

 		this.eachPoint(function (x, y, isPlaced) {
 			if(x <= 0 || x >= (COLS - 1) || y >= (ROWS - 1)
				// Check if this position is already occupied by another piece
				|| (gridPoint(x, y) != undefined && gridPoint(x, y) != 0 && isPlaced != 0))
 			{
 				result = false;
 			}
 		})

 		return result;
 	}

	// Check if the piece is in its final position (no more available actions)
	this.isFinal = function()
	{
		// Move Left or Right
		if(this.getMovedPiece(M_LEFT).isValid() || this.getMovedPiece(M_RIGHT).isValid()
			// Rotate
			|| this.getRotatedPiece(R_CW).isValid() || this.getRotatedPiece(R_CCW).isValid())
				return true;
		
		return false;
	}

	// Return a piece object that was moved left or right
 	this.getMovedPiece = function(direction)
 	{
 		var newPiece = Object.create(this);
 		newPiece.posX = this.posX + direction;
 		newPiece.posY = this.posY + 1;

 		return newPiece;
 	}

	// Return a piece object that was rotated
	this.getRotatedPiece = function(direction)
	{
		var newPiece = Object.create(this);
		var len = this.states.length;	// number of states
		// This is done because JavaScript modulo operator (%)
		// doesnt work correctly on the negative numbers
		// This is a fix; thought it would be better than an if statement
		newPiece.state = (((this.state + direction) % len) + len) % len;
		newPiece.posY = this.posY + 1;
		
		return newPiece;
	}
}

function getNextPiece()
{
	var pieceType = [
		// LinePiece
		[
			[ [1, 1, 1, 1] ],

			[ [1],
			  [1],
			  [1],
			  [1] ]
		],
		// LPiece
		[
			[ [1, 0],
			  [1, 0],
			  [1, 1] ],

			[ [1, 1, 1],
			  [1, 0, 0] ],

			[ [1, 1],
			  [0, 1],
			  [0, 1] ],

			[ [0, 0, 1],
			  [1, 1, 1] ]
		],
		// ReverseLPiece
		[
			[ [0, 1],
			  [0, 1],
			  [1, 1] ],

			[ [1, 0, 0],
			  [1, 1, 1] ],

			[ [1, 1],
			  [1, 0],
			  [1, 0] ],

			[ [1, 1, 1],
			  [0, 0, 1] ]
		],
		// ZPiece
		[
			[ [0, 1],
			  [1, 1],
			  [1, 0] ],

			[ [1, 1, 0],
			  [0, 1, 1] ]
		],
		// Block Piece
		[
			[ [1, 1],
			  [1, 1] ]
		]
	];

	// randomly generated number to select a piece type
	var number = Math.floor(Math.random() * pieceType.length);

	return new Piece(pieceType[number]);
}