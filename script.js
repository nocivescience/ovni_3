const game=document.getElementById('game');
const ctx= game.getContext('2d');
game.width=window.innerWidth;
game.height=window.innerHeight;
let Frames=0;
var moonAudio=new Audio();
var shootAudio= new Audio();
var impactAudio= new Audio();
var gameOverAudio= new Audio();
moonAudio.src='./sounds/moon.mp3';
shootAudio.src='./sounds/shot.mp3';
impactAudio.src='./sounds/impact.mp3';
gameOverAudio.src='./sounds/game-over.mp3';
class Background{
    constructor(){
        this.x=0;
        this.y=0;
        this.width=game.width;
        this.height=game.height;
        this.image=new Image();
        this.image.src='./images/terreno.png'
    }
    draw(){
        this.x--;
        if (this.x < -game.width) this.x = 0;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(
            this.image,
            this.x + this.width,
            this.y,
            this.width,
            this.height
        );
    }
}
class Ship{
    constructor(){
        this.x=game.width/4;
        this.y=game.height/4;
        this.dx=null;
        this.dy=null;
        this.images=[]
        for(let i of [1,2,3]){
            this.image=new Image();
            this.image.src=`./images/nave_${i}.png`;
            this.images.push(this.image)
        }
        this.lasers=[];
        this.canShoot=true;
        this.maxLasers=20;
    }
    shootLaser(){
        if(this.canShoot){
            this.lasers.push({
                x:this.x+200,
                vx:2,
                y:this.y+200,
            })
        }
        this.canShoot=false;
    }
    draw(){
        this.image=this.images[0]
        if(Frames%8==0){
            if(this.image==this.images[0]){
                this.image=this.images[1]
            }else{
                if(this.image==this.images[1]){
                    this.image=this.images[2]
                }else{
                    if(this.image==this.images[2]){
                        this.image=this.images[0]
                    }
                }
            }
        }
        ctx.drawImage(
            this.image,
            this.x+=this.dx,
            this.y+=this.dy,
            200,
            200,
        );
    }
    drawLaser(){
        const bomb=new Image();
        bomb.src='./images/bomb.png';
        for(let i=0;i<this.lasers.length;i++){
            ctx.drawImage(
                bomb,
                this.lasers[i].x+=this.lasers[i].vx,
                this.lasers[i].y-60,
                50,
                50
            )
            if(this.lasers[i].x>game.width){
                this.lasers.splice(this.lasers[i],1)
            }
        }
    }
}
class EnemyYellow{
    constructor(){
        this.enemiesYellow=[];
        this.coordEnemies=[];
        this.x=game.width+30;
        this.y=game.height;
        for(let i of [1,2]){
            let enemy=new Image();
            enemy.src=`./images/monster_a_${i}.png`;
            this.enemiesYellow.push(enemy);
        }
        this.enemy=this.enemiesYellow[0];
    }
    coordsYellow(){
        this.coordEnemies.push({
            x:this.x,
            y:this.y,
            random: Math.random(),
        })
    }
    drawEnemiesYellow(){
        if(Frames%1000==0){
            this.enemy=this.enemy==this.enemiesYellow[0]?this.enemiesYellow[1]:this.enemiesYellow[0]
        }
        for(let i=0;i<this.coordEnemies.length;i++){
            ctx.drawImage(
                this.enemy,
                this.coordEnemies[i]['x']--,
                this.coordEnemies[i]['y']*this.coordEnemies[i]['random'],
                60,
                60,
            )
            if(this.coordEnemies[i]['x']<-20){
                this.coordEnemies.splice(this.coordEnemies[i],1);
            }
        }
    }
}
class EnemyBlue{
    constructor(){
        this.enemiesBlue=[];
        this.coordEnemies=[];
        this.x=game.width+10;
        this.y=game.height;
        for(let i of [1,2]){
            let enemy=new Image();
            enemy.src=`./images/monster_b_${i}.png`;
            this.enemiesBlue.push(enemy);
        }
        this.enemy=this.enemiesBlue[0];
    }
    coordsBlue(){
        this.coordEnemies.push({
            x:this.x,
            y:this.y,
            random: Math.random(),
        })
    }
    drawEnemiesBlue(){
        if(Frames%1000==0){
            this.enemy=this.enemy==this.enemiesBlue[0]?this.enemiesBlue[1]:this.enemiesBlue[0]
        }
        for(let i=0;i<this.coordEnemies.length;i++){
            ctx.drawImage(
                this.enemy,
                this.coordEnemies[i]['x']--,
                this.coordEnemies[i]['y']*this.coordEnemies[i]['random'],
                60,
                60,
            );
            if(this.coordEnemies[i]['x']<-20){
                this.coordEnemies.splice(this.coordEnemies[i],1);
            }
        }
    }
}
class Lifes{
    constructor(){
        this.num=3;
    }
    draw(){
        ctx.font='15px pixelart';
        ctx.fillText('lifes:',10,35);
        for(let i=0;i<this.num;i++){
            const image=new Image();
            image.src='./images/life.png';
            ctx.drawImage(
                image,
                20*i+100,
                20,
                20,
                20
            );
        }
    }
}
class Fuel{
    constructor(){
        this.full=200;
        this.dx=5;
    }
    draw(){
        ctx.font='15px pixelart';
        ctx.fillText('Fuel: ',200,35);
        ctx.rectStyle='rgb(95, 255, 202)';
        ctx.fillRect(270,15,this.full,24);
    }
}
class Score{
    constructor(){
        this.score=0
    }
    draw(){
        ctx.font='15px pixelart';
        ctx.fillText(`Score: ${this.score}`,530,35);
    }
}
const background= new Background();
const ship=new Ship();
const enemiesYellow= new EnemyYellow();
const enemiesBlue= new EnemyBlue();
const lifes=new Lifes();
const score=new Score();
const fuel= new Fuel();
function distanceBetween(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
}
function keyDown(e){
    if(ship.x>game.width-100){
        ship.x=game.width-100
    }
    if(ship.x<0){
        ship.x=0
    }
    if(ship.y>game.height-200){
        ship.y=game.height-200
    }
    if(ship.y<0){
        ship.y=0
    }
    switch(e.key){
        case 'a':
            ship.dx=-5;
            break;
        case 'd':
            ship.dx=5;
            break;
        case 'w':
            ship.dy=-5;
            break
        case 's':
            ship.dy=5;
            break
        case 'p':
            ship.canShoot=true;
            ship.shootLaser();
            shootAudio.play();
            moonAudio.play();
            break;
    }
}
function keyUp(e){
    switch(e.key){
        case 'a':
            ship.dx=0;
            break;
        case 'd':
            ship.dx=0;
            break;
        case 'w':
            ship.dy=0;
            break
        case 's':
            ship.dy=0;
            break
        case 'p':
            ship.canShoot=true;
            break;
    }
}
function update(){
    Frames+=10;
    if(Frames%100==0){
        fuel.full-=fuel.dx;
        if(fuel.full>230){
            fuel.full=230;
            fuel.full-=fuel.dx;
        }else if(fuel.full<=0){
            clearInterval(intervalos);
            gameOverAudio.play();
            moonAudio.pause();
        }
    }
    ctx.clearRect(0,0,game.width,game.height)
    background.draw();
    ship.draw();
    ship.drawLaser()
    enemiesYellow.drawEnemiesYellow();
    enemiesBlue.drawEnemiesBlue();
    lifes.draw();
    score.draw();
    fuel.draw();
    if(lifes.num===0){
        clearInterval(intervalos);
        gameOverAudio.play();
        moonAudio.pause();
    }
    // para aniquilar a los amarillos con los lasers
    enemiesYellow.coordEnemies.forEach((enemy,i)=>{
        ship.lasers.forEach((laser,j)=>{
            if(distanceBetween(enemy['x']+30,(enemy['y']+100)*enemy['random'],laser['x']+25,laser['y']+25)<30){
                enemiesYellow.coordEnemies.splice(i,1);
                ship.lasers.splice(j,1);
                if(fuel.full>230){fuel.full=230}
                fuel.full+=30;
                score.score++;
                impactAudio.play();
            }
        })
    })
    enemiesBlue.coordEnemies.forEach((enemy,i)=>{
        ship.lasers.forEach((laser,j)=>{
            if(distanceBetween(enemy['x']+30,(enemy['y']+100)*enemy['random'],laser['x']+25,laser['y']+25)<30){
                enemiesBlue.coordEnemies.splice(i,1);
                ship.lasers.splice(j,1);
                if(fuel.full>230){fuel.full=230}
                fuel.full+=30;
                score.score++;
                impactAudio.play();
            }
            
        })
    })
    enemiesBlue.coordEnemies.forEach((enemy,i)=>{
        if(distanceBetween(ship.x+100,ship.y+100,enemy['x']+30,(enemy['y']+30)*enemy['random'])<70){
            enemiesBlue.coordEnemies.splice(i,1);
            lifes.num--;
        }
    });
    enemiesYellow.coordEnemies.forEach((enemy,i)=>{
        if(distanceBetween(ship.x+100,ship.y+100,enemy['x']+30,enemy['y']*enemy['random']+30)<70){
            enemiesYellow.coordEnemies.splice(i,1);
            lifes.num--;
        }
    });
    if(Frames%500==0){
        enemiesYellow.coordsYellow();
        enemiesBlue.coordsBlue();
    }
}
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
const intervalos=setInterval(update,10)