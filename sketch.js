var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var puntaje=0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  }

function setup() {
  createCanvas(windowWidth,windowHeight);
 
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider("circle",0,0,40);
  // trex.debug = true
  trex.scale = 0.5;
  
  ground = createSprite(width,height-90,width/2,20);
  ground.addImage("ground",groundImage);

  
  gameOver = createSprite(width/2,height/2-30);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-70,width,10);
  invisibleGround.visible = false;
  
  //creamos los grupo de nubes y obstaculos
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
     
 
 
}

function draw() {
  
  background(160);

  //despliega el puntaje
  textSize(20);
  fill("black");
  text("Puntaje: "+ puntaje, width-100,height-500);

  if(gameState === PLAY){
    //el gameover y restart se esconden durante el PLAY
    gameOver.visible = false;
    restart.visible = false;
   
     ground.velocityX = -(4 +  puntaje/150)
    //puntaje despues de 60 camaras
    puntaje = puntaje + Math.round(getFrameRate()/60)
    //agrega un punto cada 100 segundos y reproduce el sonido de moneda
    if(puntaje>0 && puntaje%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //el trex salta con el espacio 
    if((touches.lenght>0 || keyDown("space"))&& trex.y >= height-100) {
        trex.velocityY = -15;
        jumpSound.play();
      touches=[];
    }
    
    //agregamos gravedad al trex
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecen las nubes
    spawnClouds();
  
    //aparecen los obstaculos
    spawnObstacles();
    //el trex muere al chocar con los obstaculos
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //cambia la anim,acion del trex a muerto
      trex.changeAnimation("collided", trex_collided);
     //detiene la velocidad del piso y el trex a 0
      ground.velocityX = 0;
      trex.velocityY = 0
      
      //detiene el lifetime de los obstaculops y las nubes a -1 para que no desaparezcan
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     //detiene lka velocidad de los grupos al momento de morir el trex
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);   
     
      if (mousePressedOver(restart)){
       reset();
  }
   }

 
 //trex colissiona con el invisble ground
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
   gameState=PLAY;
  obstaclesGroup.destroyEach(); 
  cloudsGroup.destroyEach();
  puntaje=0;
  trex.changeAnimation("running",trex_running);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-100,10,40);
   obstacle.velocityX = -(4 + puntaje/100);
   
    //genera los obstaculos con un random del 1 al 6
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //tiempo de vida y escala de los obstaculos
    obstacle.scale = 0.5;
    obstacle.lifetime = width;
   
   //se agrgan los obstaculos al grupo de obstaculos
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
 
 if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height,40,10);
    cloud.y = Math.round(random(height-100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    //tiempo de vida de las nubes
    cloud.lifetime = width;
    
    //ajusta la profundidad del trex y las nubes
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agrga las nubes al grupo de nuibes
    cloudsGroup.add(cloud);
  }
}

