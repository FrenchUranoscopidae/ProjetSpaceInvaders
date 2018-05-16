var contentDiv = document.getElementById('screen'); //Selectionne la div qui contiendra le canvas
var x;
var shots = [];
var enemies = [];
var timer = 0;
var direction = 1;

var playx, playy, playw, playh;
var gameStart = false;
var img;
function preload() {
  img = loadImage('./img/fond_menu.png');
}


function setup() {


  var canvas = createCanvas(contentDiv.offsetWidth, contentDiv.offsetHeight); // Crée le createCanvas
  canvas.parent("screen"); // Attribut le canvas à la div.

  var numberOfRows = 5;
  x = width/2;
  for (var i = 0; i < numberOfRows; i++)
  {
    var margins = 100;
    var xoffset = margins;
    var spacing = 10;
    var enemyWidth = 50;

    while(xoffset + enemyWidth < width - margins)
    {
      enemies.push(new Enemy(createVector(xoffset, i * 60 + 10)));
      xoffset += enemyWidth + spacing;
    }
  }

  //definition du bouton play
  playx = 20;
  playy = 20;
  playw = 100;
  playh = 50;
}

function draw()
{
  background(10);
image(img, 0, 0,width,height);


  if(gameStart == false){
    rect(playx, playy, playw, playh);
  }else{
  var y = height/1.1;

  moveEnemies();

  if (keyIsDown(LEFT_ARROW))
  {
    if(x >= 10)
    {
      x -= 5;
    }
  }

  if (keyIsDown(RIGHT_ARROW))
  {
    if(x <= width - 10)
    {
      x += 5;
    }
  }

  if(timer == 0 && keyIsDown(UP_ARROW))
  {
    timer = 30;
    shots.push(new Shot(createVector(x, y)));
  }

  ellipse(x, y, 50, 50);

  for (var i = 0; i < enemies.length; i++)
  {
    var enemy = enemies[i];
    enemy.update();
    enemy.draw();
  }

  for (var i = 0; i < shots.length; i++)
  {
    var shot = shots[i];
    shot.update();
    shot.draw();
  }

  timer--;
  if(timer <= 0)
    timer = 0;
  }
}

var Shot = function(_pos)
{
  this.pos = _pos;
  this.boxShot = new AABB(10, 10);

  this.update = function()
  {
    this.pos.y -= 10;
    this.boxShot.x = this.pos.x;
    this.boxShot.y = this.pos.y;
    if(this.pos.y <= 0)
    {
      index = shots.indexOf(this);
      shots.splice(index, 1);
    }
  }

  this.draw = function()
  {
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}

var Enemy = function(_pos)
{
  this.pos = _pos;
  this.health = 3;
  this.boxEnemy = new AABB(50, 50);

  this.update = function()
  {
    this.boxEnemy.x = this.pos.x;
    this.boxEnemy.y = this.pos.y;
    this.checkCollision();

    if(this.health <= 0)
    {
      var index = enemies.indexOf(this);
      enemies.splice(index, 1);
    }
  }

  this.draw = function()
  {
    rect(this.pos.x, this.pos.y, this.boxEnemy.width, this.boxEnemy.height);
  }

  this.checkCollision = function()
  {
    for (var i = 0; i < shots.length; i++)
    {
      var shot = shots[i];

      if(checkCollisionBox(shot.boxShot, this.boxEnemy))
      {
        console.log(this.health)
        this.health -= 1;
        var index = shots.indexOf(shot);
        shots.splice(index, 1);
      }
    }
  }
}

function minX()
{
  if(enemies.length == 0)
  {
    return 0;
  }
  var m = enemies[0];

  for (var i = 0; i < enemies.length; i++)
  {
    var enemy = enemies[i];
    if(enemy.pos.x < m.pos.x)
    {
      m = enemy;
    }
  }
  return m.pos.x;
}

function maxX()
{
  if(enemies.length == 0)
  {
    return 0;
  }
  var m = enemies[0];

  for (var i = 0; i < enemies.length; i++)
  {
    var enemy = enemies[i];
    if(enemy.pos.x > m.pos.x)
    {
      m = enemy;
    }
  }
  return m.pos.x + m.boxEnemy.width;
}

var AABB = function(_width, _height)
{
  this.x = 0;
  this.y = 0;
  this.width = _width;
  this.height = _height;
}

function checkCollisionBox(box1, box2)
{
  if(box2.x >= box1.x + box1.width || box2.x + box2.width <= box1.x || box2.y >= box1.y + box1.height || box2.y + box2.height < box1.y)
  {
    return false;
  }
  else
  {
    return true;
  }
}

function moveEnemies()
{
  var border;
  if(direction == -1)
  {
    border = minX();
  }

  if(direction == 1)
  {
    border = maxX();
  }

  if (border <= 10 || border >= width - 10)
  {
    direction = -direction;
    for (enemy of enemies)
    {
      enemy.pos.y += 10;
    }
  }

  for (enemy of enemies)
  {
    enemy.pos.x += direction * 1;
  }
}

//Resize le canvas quand la taille de la page change.
function windowResized()
{
  var targetWidth = contentDiv.offsetWidth;
  var targetHeight = contentDiv.offsetHeight;
  resizeCanvas(targetWidth, targetHeight);
}



function mousePressed(){
  if(gameStart == false && mouseX > playx && mouseX < playx + playw && mouseY > playy && mouseY < playy + playh){
    gameStart = true;
  }
}
