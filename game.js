const gravityIncrement = heightOfCanvas/3000;
const jumpHeight = heightOfCanvas/100;
const gameOver = false;
//sprites
const character = {
  sprite: new Image(),
  imageSource: './assets/character.svg',
  render: () => {ctx.drawImage(character.sprite, character.x, character.y, character.dimensions, character.dimensions)},
  x: canvas.clientWidth / 25,
  y: (heightOfCanvas-(heightOfCanvas/10))/2,
  dimensions: heightOfCanvas/10,
  jumpAchived: true,
  velocity: 0,
  targetY: (heightOfCanvas-(heightOfCanvas/10))/2,
  onGround: false,
  atRoof: false,
  numOfSecondsOnGround: 0,
  numOfSecondsOnRoof: 0,
}
character.sprite.onload = character.render;
character.sprite.src = character.imageSource;
spikes = [new Spike(true), new Spike(false)];
coin = new Coin();
//control
document.onkeydown = (e) => {
  if(e.key == " " || e.code.toLowerCase() == "space" || e.key == "ArrowUp") jump();
  if(e.key == "Escape" || e.code == "Escape") {
    if(paused) paused = false;
    else needsToBePaused = true;
  };
}
const jump = () => {
  if(!paused){
    character.velocity = 0;
    character.jumpAchived = false;
    character.targetY = character.y-heightOfCanvas/5;
  }
}
canvas.onclick = () => {
  if(paused) paused = false;
  else jump();
};
document.onclick = () => {
  if(paused) paused = false;
}
//game loop
setInterval(() => {
  if(paused || needsToBePaused){
    if(needsToBePaused){
      character.render();
      paused = true;
      needsToBePaused = false;
      ctx.strokeStyle = 'gray';
      ctx.fillStyle = 'gray';
      ctx.font = '50px Verdana';
      ctx.strokeText("PAUSED", canvas.clientWidth / 2-100, heightOfCanvas / 2);
      ctx.font = '20px Verdana';
      ctx.fillText("Click anywhere to resume.", canvas.clientWidth / 2-130, heightOfCanvas / 2+50);
    }
  }else{
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
    if((character.jumpAchived && !character.onGround) || character.atRoof){
      character.atRoof = false;
      character.y+=character.velocity;
      character.velocity+=gravityIncrement;
      if(character.y >= heightOfCanvas-character.dimensions){
        velocity = 0;
        character.onGround = true;

      }
    }else if(!character.jumpAchived){
      character.onGround = false;
      character.numOfSecondsOnGround = 0;
      character.y-=jumpHeight;
      if(character.y <= character.targetY) {
        character.jumpAchived = true;
      }
      if(character.y <= 1){
        velocity = 0;
        character.atRoof = true;
        character.jumpAchived = true;
      }
    }else if(character.onGround){
      character.numOfSecondsOnGround++;
      if(character.numOfSecondsOnGround == 100){
        internalCounter-= 3;
        pointsCounter.innerHTML = internalCounter;
        logIncrement++;
        if(logIncrement == 10){
          log.innerHTML = '';
          logIncrement = 0;
        }
        log.innerHTML = `<div style = "color: red;">STOP PROCRASTINATING.</div><div style = "color: red;float: right;">-3</div><br><br>${log.innerHTML}`;
        character.numOfSecondsOnGround = 0;
      }
    }
    character.render();
    for (i = 0; i<2;i++) {
      if(i == 0 || spikes[1].rendered){
        spikes[i].update();
      }else{
        if(spikes[0].x < canvas.clientWidth/2){
          spikes[1].render();
          spikes[1].rendered = true;
        }
      }
    }
    if(!coin.rendered){
      if(spikes[0].x < canvas.clientWidth/1.5){
        coin.update();
        coin.rendered = true;
      }
    }else{
      coin.update();
    }
  }
}, 20);