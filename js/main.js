(() => {
	'use strict';

	const gameWidth     = 606;
	const gameHeight    = 594;
	let gameLive        = true,
	      points        = 0,
	      pointsMult    = 50,
	      life          = 5,
	      rightKey      = false,
	      leftKey       = false,
	      upKey         = false,
	      downKey       = false,
	      spacePressed  = false,
	      isMoving      = false,
	      gemsCollected = 0,
	      frameCount    = 0;

	//Load Map Image
	let mapImage = new Image();
	mapImage.src = 'images/map.png';

	function Bug(speed, x, y, width, height, srcX, srcY, colX, colY) {
		this.speed  = speed;
		this.x      = x;
		this.y      = y;
		this.width  = width;
		this.height = height;
		this.srcX   = srcX;
		this.srcY   = srcY;
		this.colX   = colX;
		this.colY   = colY;
	}

	let bugs = [
		new Bug(1, 0, 0, 99, 77, 0, 30, 99, 77),
		new Bug(2, 0, 0, 99, 77, 0, 130, 99, 77),
		new Bug(1.5, 0, 0, 99, 77, 0, 230, 99, 77),
		new Bug(3, 0, 0, 99, 77, 0, 330, 99, 77)
	];

	let bugImage = new Image();
	bugImage.src = 'images/enemy-bug.png';

	//Hero Constructor
	function Hero(speed, x, y, width, height, srcX, srcY, colX, colY) {
		this.speed  = speed;
		this.x      = x;
		this.y      = y;
		this.width  = width;
		this.height = height;
		this.srcX   = srcX;
		this.srcY   = srcY;
		this.colX   = colX;
		this.colY   = colY;
	}

	//Create Hero Object
	let hero = new Hero(20, 280, 450, 67, 88, 0, 0, 50, 70);

	//Load Hero Image
	let heroImage = new Image();
	heroImage.src = 'images/hero.png';

	//Gem Constructor
	function Gem(x, y, width, height) {
		this.x      = x;
		this.y      = y;
		this.width  = width;
		this.height = height;
	}

	// Create Gem Object
	let gem = new Gem(50 + (Math.random() * (gameWidth - 101)), 50 + (Math.random() * (gameHeight - 101)), 47, 55);

	//Load Gem Image
	let gemImage = new Image();
	gemImage.src = 'images/Gem_Orange.png';

	//Returns the drawing context on the canvas
	let canvas = document.querySelector('canvas');
	let ctx    = canvas.getContext('2d');

	// Keyboard Functions
	function keyDownHandler(event) {
		if (event.keyCode == 39) {
			rightKey = true;
			isMoving = true;
		}
		else if (event.keyCode == 37) {
			leftKey  = true;
			isMoving = true;
		}
		if (event.keyCode == 40) {
			downKey  = true;
			isMoving = true;
		}
		else if (event.keyCode == 38) {
			upKey    = true;
			isMoving = true;
		}
		if (event.keyCode == 32) {
			spacePressed = true;
		}
	}

	function keyUpHandler(event) {
		if (event.keyCode == 39) {
			rightKey = false;
			isMoving = false;
		}
		else if (event.keyCode == 37) {
			leftKey  = false;
			isMoving = false;
		}
		if (event.keyCode == 40) {
			downKey  = false;
			isMoving = false;
		}
		else if (event.keyCode == 38) {
			upKey    = false;
			isMoving = false;
		}
		if (event.keyCode == 32) {
			spacePressed = false;
		}
	}

	// Start Game
	function startGame() {
		init();
	}

	//Updated the Game
	function update() {
		//Check Collision with Gem
		if (hero.x < gem.x + gem.width &&
		    hero.x + hero.colX > gem.x &&
		    hero.y < gem.y + gem.height &&
		    hero.colY + hero.y > gem.y) {
			gemsCollected += 1;
			gem.x  = 50 + (Math.random() * (gameWidth - 101));
			gem.y  = 50 + (Math.random() * (gameHeight - 101));
			points = gemsCollected * pointsMult;
		}

		//Keyboard Move Hero and Define Sprite Sheet
		if (isMoving) {
			if (rightKey == true) {
				hero.x += hero.speed;
			}
			else if (leftKey == true) {
				hero.x -= hero.speed;
			}
			else if (downKey == true) {
				hero.y += hero.speed;
			}
			else if (upKey == true) {
				hero.y -= hero.speed;
			}
		}

		// Bugs Functions (Move, Collision)
		bugs.forEach(function (bug) {
			//Check Collision with Bug
			if (hero.x < bug.srcX + bug.colX &&
			    hero.x + hero.colX > bug.srcX &&
			    hero.y < bug.srcY + bug.colY &&
			    hero.colY + hero.y > bug.srcY) {
				//Stop the Game and Reduce Life
				if (life === 0) {
					points        = 0;
					life          = 6;
					gemsCollected = 0;
				}
				//If Collision, reduces one live
				if (life > 0) {
					life -= 1;
				}
				//Define Position of Hero at Game Over
				hero.x = 210;
				hero.y = 450;
			}

			//Move the Bugs
			bug.srcX += bug.speed;

			//Define Borders for Bugs
			if (bug.srcX >= gameWidth) {
				bug.srcX = 0;
				bug.speed *= 1;
				bug.srcX = 0;
			}
			else if (bug.x >= gameWidth - 10) {
				bug.srcX = -50;
				bug.speed *= 1;
			}
		});

		//Define Map Borders for Hero
		if (hero.y <= 10) {
			hero.y = 10;
		}
		else if (hero.y >= gameHeight - 115) {
			hero.y = gameHeight - 115;
		}
		if (hero.x <= 10) {
			hero.x = 10;
		}
		else if (hero.x >= gameWidth - 80) {
			hero.x = gameWidth - 80;
		}
	}

	//Draw the map
	function drawMap() {
		ctx.drawImage(mapImage, 0, 0);
	}

	//Draw the Game
	function draw() {
		//Draw Canvas
		drawMap();
		document.querySelector('#points').innerHTML = points;
		document.querySelector('#life').innerHTML   = life;

		//Draw Hero
		ctx.drawImage(heroImage, hero.srcX, hero.srcY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);

		//Draw Bugs
		bugs.forEach(function (bug) {
			ctx.drawImage(bugImage, bug.x, bug.y, bug.width, bug.height, bug.srcX, bug.srcY, bug.colX, bug.colY);
		});

		//Draw gem
		ctx.drawImage(gemImage, 0, 0, gem.width, gem.height, gem.x, gem.y, gem.width, gem.height);
	}

	//Game Loop
	function init() {
		update();
		draw();
		if (gameLive) {
			window.requestAnimationFrame(init);
			isMoving = false;
		}
		frameCount += 1;
	}

	//Event Listeners
	document.addEventListener('keydown', keyDownHandler);
	document.addEventListener('keyup', keyUpHandler);
	window.addEventListener('load', startGame);

})();
