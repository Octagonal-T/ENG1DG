class Coin{
  static imageSource = './assets/salamanchuk_coin.svg';
  constructor(){
    this.winReason = winReasons[Math.floor(Math.random()*winReasons.length)];
    this.sprite = new Image();
    this.dimensions = heightOfCanvas / 10;
    this.render =  () => {ctx.drawImage(this.sprite, this.x, this.y, this.dimensions, this.dimensions)};
    this.y = Math.floor(Math.random()*(heightOfCanvas-this.dimensions));
    this.x = canvas.clientWidth;
    // this.x = 50;
    this.y = 50;
    this.speed = Math.floor(Math.random()*20)+5;
    this.sprite.onload = this.render;
    this.sprite.src = Coin.imageSource;
    this.offScreen = false;
    this.rendered = false;
    this.winReason = Math.floor(Math.random()*winReasons.length);
  }
  restart(){
    ctx.clearRect(this.x, this.y, this.dimensions, this.dimensions);
    this.y = Math.floor(Math.random()*(heightOfCanvas-this.dimensions));
    this.x = canvas.clientWidth;
    this.speed = Math.floor(Math.random()*15)+5;
    this.winReason = Math.floor(Math.random()*winReasons.length);
  }
  update(){
    if(this.offScreen){
      this.restart();
      this.offScreen = false;
    }else{
      this.x-= this.speed;
      this.render();
      if(this.x < character.x && this.x > character.x-this.dimensions){
        this.checkIfContacting();
      }
      if(this.x < 0 - this.dimensions){
        this.offScreen = true;
      }
    }
  }
  checkIfContacting(){
    let characterX = Math.round(character.x)
    let characterY = Math.round(character.y)
    let bordersPlayer = [
      [[characterX, characterY], [characterX+character.dimensions, characterY]], // top border
      [[characterX+character.dimensions, characterY], [characterX+character.dimensions, characterY+character.dimensions]], //middle border
      [[characterX, characterY+character.dimensions], [characterX+character.dimensions, characterY+character.dimensions]] // bottom boder
     ];
    let coordinatesCoin = [[characterX, this.y], [characterX+character.dimensions, this.y+this.dimensions]]; // top left, bottom right
    let flag = false;
    for (let i = 0; i < 3 && !flag; i++) {
      for (let j = 0; j < character.dimensions; j++){
        let checkingX = bordersPlayer[i][0][0] + (i == 1 ? 0 : j);
        let checkingY = bordersPlayer[i][0][1] + (i == 1 ? j : 1);
        if(
          (checkingX >= coordinatesCoin[0][0] && checkingX < coordinatesCoin[1][0]) &&
          (checkingY >= coordinatesCoin[0][1] && checkingY < coordinatesCoin[1][1])){
            flag = true;
            break;
          }
      }
    }
    if(flag) {
      internalCounter += winReasons[this.winReason].p;
      pointsCounter.innerHTML = internalCounter;
      logIncrement++;
      if(logIncrement == 10){
        log.innerHTML = '';
        logIncrement = 0;
      }
      log.innerHTML= `<div style = "color: green;">${winReasons[this.winReason].d}</div><div style = "color: green;float: right;">+${winReasons[this.winReason].p}</div><br><br>${log.innerHTML}`
      if(pausesAfterPoint) needsToBePaused=true;
      this.restart();

    }
  }
}