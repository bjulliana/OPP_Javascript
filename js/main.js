(() => {
	'use strict';

	const gameWidth     = 606;
	const gameHeight    = 594;
	let gameLive        = true,
	      points        = 0,
	      pointsMult    = 50,
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

	Bug.prototype.move = function () {
		//Move the Bugs
		this.srcX += this.speed;

		//Define Borders for Bugs
		if (this.srcX >= gameWidth) {
			this.srcX = 0;
			this.speed *= 1;
			this.srcX = 0;
		}
		else if (this.x >= gameWidth - 10) {
			this.srcX = -50;
			this.speed *= 1;
		}
	};

	//Hero Constructor
	function Hero(life, speed, x, y, width, height, srcX, srcY, colX, colY) {
		this.life   = life;
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
	let hero = new Hero(5, 20, 280, 450, 67, 88, 0, 0, 50, 70);

	//Load Hero Image
	let heroImage = new Image();
	heroImage.src = 'images/hero.png';

	Hero.prototype.die = function () {
		alert('Game Over');
		points        = 0;
		this.life     = 6;
		gemsCollected = 0;
	};

	Hero.prototype.move = function () {
		if (rightKey === true) {
			this.x += this.speed;
		}
		else if (leftKey === true) {
			this.x -= this.speed;
		}
		else if (downKey === true) {
			this.y += this.speed;
		}
		else if (upKey === true) {
			this.y -= this.speed;
		}
	};

	Hero.prototype.limits = function () {
		//Define Map Borders for Hero
		if (this.y <= 10) {
			this.y = 10;
		}
		else if (this.y >= gameHeight - 115) {
			this.y = gameHeight - 115;
		}
		if (this.x <= 10) {
			this.x = 10;
		}
		else if (this.x >= gameWidth - 80) {
			this.x = gameWidth - 80;
		}
	};

	//Gem Constructor
	function Gem(x, y, width, height) {
		this.x      = x;
		this.y      = y;
		this.width  = width;
		this.height = height;
	}

	Gem.prototype.collected = function () {
		gemsCollected += 1;
		this.x = 50 + (Math.random() * (gameWidth - 101));
		this.y = 50 + (Math.random() * (gameHeight - 101));
		points = gemsCollected * pointsMult;
	};

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
		if (event.keyCode === 39) {
			rightKey = true;
			isMoving = true;
		}
		else if (event.keyCode === 37) {
			leftKey  = true;
			isMoving = true;
		}
		if (event.keyCode === 40) {
			downKey  = true;
			isMoving = true;
		}
		else if (event.keyCode === 38) {
			upKey    = true;
			isMoving = true;
		}
		if (event.keyCode === 32) {
			spacePressed = true;
		}
	}

	function keyUpHandler(event) {
		if (event.keyCode === 39) {
			rightKey = false;
			isMoving = false;
		}
		else if (event.keyCode === 37) {
			leftKey  = false;
			isMoving = false;
		}
		if (event.keyCode === 40) {
			downKey  = false;
			isMoving = false;
		}
		else if (event.keyCode === 38) {
			upKey    = false;
			isMoving = false;
		}
		if (event.keyCode === 32) {
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
			gem.collected();
		}

		//Keyboard Move Hero
		if (isMoving) {
			hero.move();
		}

		// Bugs Functions (Move, Collision)
		bugs.forEach(function (bug) {
			//Check Collision with Bug
			if (hero.x < bug.srcX + bug.colX &&
			    hero.x + hero.colX > bug.srcX &&
			    hero.y < bug.srcY + bug.colY &&
			    hero.colY + hero.y > bug.srcY) {
				//Stop the Game and Reduce Life
				if (hero.life === 0) {
					hero.die();
				}
				//If Collision, reduces one live
				if (hero.life > 0) {
					hero.life -= 1;
				}
				//Define Position of Hero at each Collision with Bug
				hero.x = 210;
				hero.y = 450;
			}

			bug.move();
		});

		hero.limits();
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
		document.querySelector('#life').innerHTML   = hero.life;

		//Draw Hero
		ctx.drawImage(heroImage, hero.srcX, hero.srcY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);

		//Draw Bugs
		bugs.forEach(function (bug) {
			ctx.drawImage(bugImage, bug.x, bug.y, bug.width, bug.height, bug.srcX, bug.srcY, bug.colX, bug.colY);
		});

		//Draw Gem
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
	}

	//Event Listeners
	document.addEventListener('keydown', keyDownHandler);
	document.addEventListener('keyup', keyUpHandler);
	window.addEventListener('load', startGame);

})();
