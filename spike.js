let spikes = [];
class Spike {
  static imageSource = './assets/spike.svg';
  constructor(num){
    this.sprite = new Image();
    this.width = canvas.clientWidth / 5;
    this.height = heightOfCanvas / 5;
    this.render = () => {ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height)}
    this.y = Math.floor(Math.random()*(heightOfCanvas-this.height));
    this.x = canvas.clientWidth;
    this.speed = Math.floor(Math.random()*20)+5;
    this.sprite.onload = this.render;
    this.sprite.src = Spike.imageSource;
    this.offScreen = false;
    this.rendered = false;
    this.num = num; // is the number the first one?
    this.deathReason = Math.floor(Math.random()*deathReasons.length);
  }
  restart(){
    ctx.clearRect(this.x, this.y, this.width, this.height);
    do{
      this.y = Math.floor(Math.random()*(heightOfCanvas-this.height));
    }while(this.y > spikes[this.num ? 1 : 0].y-this.height && this.y < spikes[this.num ? 1 : 0].y+this.height);
    this.x = canvas.clientWidth;
    this.speed = Math.floor(Math.random()*15)+5;
    this.deathReason = Math.floor(Math.random()*deathReasons.length);
  }
  checkIfContacting(){
    let characterX = Math.round(character.x)
    let characterY = Math.round(character.y)
    let bordersPlayer = [
      [[characterX, characterY], [characterX+character.dimensions, characterY]], // top border
      [[characterX+character.dimensions, characterY], [characterX+character.dimensions, characterY+character.dimensions]], //middle border
      [[characterX, characterY+character.dimensions], [characterX+character.dimensions, characterY+character.dimensions]] // bottom boder
     ];
    let coordinatesSpike = [[characterX, this.y], [characterX+character.dimensions, this.y+this.height]]; // top left, bottom right
    let flag = false;
    for (let i = 0; i < 3 && !flag; i++) {
      for (let j = 0; j < character.dimensions; j++){
        let checkingX = bordersPlayer[i][0][0] + (i == 1 ? 0 : j);
        let checkingY = bordersPlayer[i][0][1] + (i == 1 ? j : 1);
        if(
          (checkingX >= coordinatesSpike[0][0] && checkingX < coordinatesSpike[1][0]) &&
          (checkingY >= coordinatesSpike[0][1] && checkingY < coordinatesSpike[1][1])){
            flag = true;
            break;
          }
      }
    }
    if(flag) {
      internalCounter-= deathReasons[this.deathReason].p;
      pointsCounter.innerHTML = internalCounter;
      logIncrement++;
      if(logIncrement == 10){
        log.innerHTML = '';
        logIncrement = 0;
      }
      log.innerHTML = `<div style = "color: red;">${deathReasons[this.deathReason].d}</div><div style = "color: red;float: right;">-${deathReasons[this.deathReason].p}</div><br><br>${log.innerHTML}`
      if(pausesAfterPoint) needsToBePaused=true;
      this.restart();
    }
  }
  update(){
    if(this.offScreen){
      this.restart();
      this.offScreen = false;
    }else{
      this.x-= this.speed;
      this.render();
      if(this.x < character.x && this.x > character.x-this.width){
        this.checkIfContacting();
      }
      if(this.x < 0 - this.width){
        this.offScreen = true;
      }
    }
  }
}
