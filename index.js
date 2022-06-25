class Camera {
    constructor(x, y) {
        this.x = x || 0
        this.y = y || 0 
    }
    move(x,y) {
        this.x += x || 0
        this.y += y || 0 
    }
    animate() {
        window.requestAnimationFrame(CAMERA.animate)
        c.fillStyle = 'pink'
        c.fillRect(0,0, canvas.width, canvas.height)
        player.update()
        renderMap()
        if (player.position.x - CAMERA.x >= 0.6*canvas.width || player.position.x - CAMERA.x <= 0.2*canvas.width) CAMERA.move(player.dx*1.1, 0)
        if (player.position.y - CAMERA.y >= 0.8*canvas.height || player.position.y - CAMERA.y <= 0.2*canvas.height) CAMERA.move(0, -player.dy*1.1)

    }
}
class Sprite {
    GRAVITY = 0.3
    JUMP =   16
    constructor(position, size, velocity) {
        this.position = position    
        this.size = size

        this.dy = velocity.y
        this.dx = velocity.x

        this.isFloored = true

        this.isUp = false
        this.isDown = false
        this.isRight = false
        this.isLeft = false
    }
    draw() {
        if (this.position.x+this.size.x-CAMERA.x < 0 || this.position.x-CAMERA.x >= canvas.width ||
            this.position.y+this.size.y+CAMERA.y < 0 || this.position.y+CAMERA.y >= canvas.height ) return
        c.fillStyle = "red"
        c.fillRect(this.position.x-CAMERA.x, this.position.y+CAMERA.y, this.size.x, this.size.y)
    }
    update() {
        this.dy += this.GRAVITY
        if (this.isUp && this.isFloored) {
            this.dy -= this.JUMP
            this.isFloored = false
        }

        if (this.isLeft) {
            this.dx = -5
        }
        else if (this.isRight) {
            this.dx = 5
        }
        else this.dx = 0
        
        if (this.dx !== 0) {
           this.isCollisionX()    
        }
        this.position.x += this.dx

        if (this.dy !== 0) {
            this.isCollisionY()    
        }
        this.position.y += this.dy
        this.draw()

        
    }
    isCollision(x, y) {
        return x >= 0 && x < row &&
               y >= 0 && y < column &&
               map[y][x] >= 1
    }
    isCollisionY() {
        let minX = this.DIV(this.position.x, TILE_WIDTH)
        let maxX = this.DIV(this.position.x+this.size.x, TILE_WIDTH)
        let minY = 0;
        let maxY = 0;
        if (this.dy < 0) {
            minY = this.DIV(this.position.y+this.dy, TILE_HEIGHT);
            maxY = this.DIV(this.position.y,         TILE_HEIGHT);
        } else {
            minY = this.DIV(this.position.y+this.size.y,         TILE_HEIGHT);
            maxY = this.DIV(this.position.y+this.size.y+this.dy, TILE_HEIGHT);
        }

        loop:
        for (let y = minY; y <= maxY; ++y) {
            for (let x = minX; x <= maxX; ++x) {
                if (this.isCollision(x,y)) {
                    if (this.dy < 0.0) {
                        this.y = (y + 1) *TILE_HEIGHT
                    } else {
                        this.y = (y - 1) *TILE_HEIGHT// - this. - 1;
                        this.isFloored = true
                    }
                    this.dy = 0.0;
                    break loop;
                }
            }
        }
    }
    isCollisionX() {
        let minY = this.DIV(this.position.y, TILE_HEIGHT)
        let maxY = this.DIV(this.position.y+this.size.y, TILE_HEIGHT)
        let minX = 0;
        let maxX = 0;
        if (this.dx < 0) {
            minX = this.DIV(this.position.x+this.dx, TILE_WIDTH);
            maxX = this.DIV(this.position.x,         TILE_WIDTH);
        } else {
            minX = this.DIV(this.position.x+this.size.x,         TILE_WIDTH);
            maxX = this.DIV(this.position.x+this.size.x+this.dx, TILE_WIDTH);
        }

        loop:
        for (let y = minY; y <= maxY; ++y) {
            for (let x = minX; x <= maxX; ++x) {
                if (this.isCollision(x,y)) {
                    this.x = this.dx < 0.0 ?
                        (x + 1) *TILE_WIDTH:
                        (x - 1) *TILE_WIDTH// - this. - 1;
                
                    this.dx = 0.0;
                    break loop;
                }
            }
        }
    }
    DIV(i, w) {
        return (i - i%w)/w >= 0 ? (i - i%w)/w : 0
    }
}

function DIV(i, w) {
    return (i - i%w)/w >= 0 ? (i - i%w)/w : 0
}
function renderMap() {
    let maxY = (CAMERA.y - CAMERA.y % TILE_HEIGHT)/TILE_HEIGHT
    let minX = (CAMERA.x - CAMERA.x % TILE_WIDTH)/TILE_WIDTH
    let maxX = minX+DIV(canvas.width, TILE_WIDTH)+2 <= row ? minX+DIV(canvas.width, TILE_WIDTH)+2 : row;
    minX = minX < 1 ? 1 : minX
    maxY = maxY < 1 ? 1 : maxY
    
    console.log(minX)
    for(let y = 0; y < column; y++){
        for(let x = minX-1; x < maxX; x++){
            switch(map[y][x]) {
                case 0: continue;
                case 1: c.fillStyle = "black"; break;
                default:continue
        }
        c.fillRect(x*TILE_WIDTH-CAMERA.x, y*TILE_HEIGHT+CAMERA.y, TILE_WIDTH-1, TILE_HEIGHT-1);
      }
    }
}
function parseMap(text) {
    let nm = text.split('\r\n')
    row = nm[0].length 
    column = nm.length
    for (let a = 0; a < nm.length; a++) {
        for (let b = 0; b < nm[a].length; b++) {
            map[a][b] = parseInt(nm[a][b])
        }
    }
    console.log(row, column)
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1336//1024
canvas.height = 768//576
var map = [ 
    [1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1] 
        ];
    
const TILE_WIDTH  = 72
const TILE_HEIGHT = 72
    
const CAMERA = new Camera(-100,0)
const player = new Sprite({x:200, y:90}, {x:3, y:50}, {x:0,y:0})
document.addEventListener('keydown', (e) => {
    switch(e.key.toUpperCase()) {
        case "W": player.isUp = true; break;
        case "S": player.isDown = true; break;
        case "A": player.isLeft = true; break;
        case "D": player.isRight = true; break;
}})
document.addEventListener('keyup', (e) => {
    switch(e.key.toUpperCase()) {
        case "W": player.isUp = false; break;
        case "S": player.isDown = false; break;
        case "A": player.isLeft = false; break;
        case "D": player.isRight = false; break;
}})

fetch('level-1.txt')
  .then(response => response.text())
  .then((text) => parseMap(text))
  .then(CAMERA.animate)