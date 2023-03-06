const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')

const score = document.querySelector('#scoreNumber')

const playAgain = document.getElementById('playAgain')
const win = document.getElementById('win')
const lose = document.getElementById('lose')


canvas.height = innerHeight
canvas.width = innerWidth

class Boundary {

    // Funções ou variáveis que só podem ser chamadas através da classes
    static width = 40
    static height = 40

    constructor({ position, image }) {

        this.position = position
        this.width = 40
        this.height = 40
        this.image = image

    }

    draw() {

        /*c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)*/

        c.drawImage(this.image, this.position.x, this.position.y)

    }

}

class Player {

    constructor({position, velocity}) {

        this.position = position
        this.velocity = velocity
        this.radius = 15

    }

    update() {

        // Incremento das posições
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }

    draw() {

        this.update()

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()

    }

}

class Ghost {

    static speed = 2

    constructor({position, velocity, color = 'red'}) {

        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollision = []
        this.speed = 2.5
        this.scared = false

    }

    update() {

        // Incremento das posições
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }

    draw() {

        this.update()

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()

    }

}

class Coins {

    constructor({ position }) {

        this.position = position
        this.radius = 3

    }

    draw() {

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()

    }

}

class PowerUp {

    constructor({ position }) {

        this.position = position
        this.radius = 8

    }

    draw() {

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()

    }

}

const coins = []

const boundaries = []

const powerUps = []

const ghosts = [

    new Ghost({

        position: {
            x: Boundary.width * 3 + Boundary.width/2,
            y: Boundary.height * 7 + Boundary.height/2
        },

        velocity: {
            x: Ghost.speed,
            y: 0
        },

    }),

    new Ghost({

        position: {
            x: Boundary.width * 7 + Boundary.width/2,
            y: Boundary.height * 7 + Boundary.height/2
        },

        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'

    }),

    new Ghost({

      position: {
          x: Boundary.width * 7 + Boundary.width/2,
          y: Boundary.height * 5 + Boundary.height/2
      },

      velocity: {
          x: Ghost.speed,
          y: 0
      },
      color: 'green'

  }),

  new Ghost({

    position: {
        x: Boundary.width * 3 + Boundary.width/2,
        y: Boundary.height * 5 + Boundary.height/2
    },

    velocity: {
        x: Ghost.speed,
        y: 0
    },
    color: 'orange'

})

]

const player = new Player({

    position: {

        x: Boundary.width + (Boundary.width/2),
        y: Boundary.height + (Boundary.height/2)

    },

    velocity: {
        x: 0,
        y: 0
    }
})

// Verificando se as teclas estão pressionadas
const keys = {
    w: {
        pressed: false
    },

    a: {
        pressed: false
    },

    s: {
        pressed: false
    },

    d: {
        pressed: false
    }
}

let lastKey;
let scorePoints = 0

function createImage(src) {

    const image = new Image()
    image.src = src
    return image

}

// Base do mapa
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]
  
  // Additional cases (does not include the power up pellet that's inserted later in the vid)
  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {

        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeHorizontal.png')
            })
          )
          break;

        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeVertical.png')
            })
          )
          break;

        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner1.png')
            })
          )
          break;

        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner2.png')
            })
          )
          break;

        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner3.png')
            })
          )
          break;

        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner4.png')
            })
          )
          break;

        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/block.png')
            })
          )
          break;

        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capLeft.png')
            })
          )
          break;

        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capRight.png')
            })
          )
          break;

        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capBottom.png')
            })
          )
          break;

        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capTop.png')
            })
          )
          break;

        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeCross.png')
            })
          )
          break;

        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorTop.png')
            })
          )
          break;

        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorRight.png')
            })
          )
          break;

        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorBottom.png')
            })
          )
          break;

        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeConnectorLeft.png')
            })
          )
          break;

          case '.':
          coins.push(
            new Coins({
              position: {
                x: j * Boundary.width + Boundary.width/2,
                y: i * Boundary.height + Boundary.height/2
              }
            })
          )
          break;

          case 'p':
          powerUps.push(
            new PowerUp({
              position: {
                x: j * Boundary.width + Boundary.width/2,
                y: i * Boundary.height + Boundary.height/2
              }
            })
          )
          break;
        
      }
    })
  })

// Eventos de teclado para movimento do personagem
addEventListener('keydown', ({key}) => {


    switch(key) {
        case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break;

        case 's':
        keys.s.pressed = true
        lastKey = 's'
        break;

        case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break;

        case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break;
    }
})

addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'w':
        keys.w.pressed = false
        break;

        case 's':
        keys.s.pressed = false
        break;

        case 'd':
        keys.d.pressed = false
        break;

        case 'a':
        keys.a.pressed = false
        break;
    }
})

let animationId;
// Função de animação
function animate() {

    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

        // Se alguma das teclas forem pressionadas, movimento do personagem, também prever o movimento do usuário
        if (keys.w.pressed && lastKey === 'w') {

            for (let i = 0; i < boundaries.length; i++) {

                const boundary = boundaries[i]

                if (
                    detectColision({
                        circle: {
                            ...player, 
                            velocity: {
                                x: 0,
                                y: -5
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    player.velocity.y = 0
                    break;

                } else {

                    player.velocity.y = -5

                }

            }
            
        } else if (keys.a.pressed && lastKey === 'a') {

            for (let i = 0; i < boundaries.length; i++) {

                const boundary = boundaries[i]

                if (
                    detectColision({
                        circle: {
                            ...player, 
                            velocity: {
                                x: -5,
                                y: 0
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    player.velocity.x = 0
                    break;

                } else {

                    player.velocity.x = -5

                }

            }

        } else if (keys.s.pressed && lastKey === 's') {

            for (let i = 0; i < boundaries.length; i++) {

                const boundary = boundaries[i]

                if (
                    detectColision({
                        circle: {
                            ...player, 
                            velocity: {
                                x: 0,
                                y: 5
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    player.velocity.y = 0
                    break;

                } else {

                    player.velocity.y = 5

                }

            }

        } else if (keys.d.pressed && lastKey === 'd') {

            for (let i = 0; i < boundaries.length; i++) {

                const boundary = boundaries[i]

                if (
                    detectColision({
                        circle: {
                            ...player, 
                            velocity: {
                                x: 5,
                                y: 0
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    player.velocity.x = 0
                    break;

                } else {

                    player.velocity.x = 5

                }

            }

        }

    // Detectando colisões entre jogador e fantasmas (quando está com o poder especial)
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]

        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y
                ) < 
                ghost.radius + player.radius

            )   {

                    if (ghost.scared) {

                        ghosts.splice(i, 1) // Fazendo o fantasma ser comido

                    } else {

                        cancelAnimationFrame(animationId)
                        
                        lose.hidden = false
                        win.hidden = true
                        playAgain.hidden = false

                    }
                
                }

    }

    // Condição para ganhar
    if (coins.length === 0) { // Quando as moedas acabarem

        cancelAnimationFrame(animationId)

        win.hidden = false
        lose.hidden = true
        playAgain.hidden = false

    }

    // Poder especial
    for (let i = powerUps.length - 1; 0 <= i; i--) {

        const powerUp = powerUps[i]
        powerUp.draw()

        // Colisão do jogador com o poder especial
        if (
            Math.hypot(
                powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y
                ) < 
                powerUp.radius + player.radius
            )   {

                powerUps.splice(i, 1)

                // Fazer o fantasmas ficarem assustados
                ghosts.forEach((ghost) => {

                    ghost.scared = true

                    setTimeout(() => {

                        ghost.scared = false

                    }, 3000)
            
                })
            } 

    }

    // Tocando nas moedas e contando os pontos
    for (let i = coins.length - 1; 0 <= i; i--) {

        const coin = coins[i]
        coin.draw()

        if (Math.hypot(coin.position.x - player.position.x,
            coin.position.y - player.position.y) < coin.radius + player.radius)
            {
                coins.splice(i, 1)
                scorePoints += 10
                score.innerHTML = scorePoints
            }

    }
   
    boundaries.forEach((boundary) => {

        boundary.draw()

        // Detectando colisões
        if (detectColision({ circle: player, rectangle: boundary})) {

            player.velocity.x = 0
            player.velocity.y = 0

        }
            
    })

    player.draw()

    ghosts.forEach((ghost) => {

        ghost.draw()

        const collisions = []
        boundaries.forEach((boundary => {
            for (let i = 0; i < boundaries.length; i++) {

                const boundary = boundaries[i]

                if (
                    !collisions.includes('right') &&
                    detectColision({
                        circle: {
                            ...ghost, 
                            velocity: {
                                x: ghost.speed,
                                y: 0
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    collisions.push('right')
                    
                } 

                if (
                    !collisions.includes('left') &&
                    detectColision({
                        circle: {
                            ...ghost, 
                            velocity: {
                                x: -ghost.speed,
                                y: 0
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    collisions.push('left')
                    
                }

                if (
                    !collisions.includes('up') &&
                    detectColision({
                        circle: {
                            ...ghost, 
                            velocity: {
                                x: 0,
                                y: -ghost.speed
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    collisions.push('up')
                    
                } 

                if (
                    !collisions.includes('down') &&
                    detectColision({
                        circle: {
                            ...ghost, 
                            velocity: {
                                x: 0,
                                y: ghost.speed
                            }
                        }, 
                    
                        rectangle: boundary
                    
                    })

                ) {

                    collisions.push('down')
                    
                } 

            }

        }))

        if (collisions.length > ghost.prevCollision) {

            ghost.prevCollision = collisions

        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollision)) {

            //console.log('gogo')

            
            if (ghost.velocity.x > 0) ghost.prevCollision.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollision.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollision.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollision.push('down')

            //console.log(collisions)
            //console.log(ghost.prevCollision)

            const pathways = ghost.prevCollision.filter(collision => {
                return !collisions.includes(collision)
            })

            //console.log({pathways})

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            //console.log({direction})

            switch(direction) {

                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break;

                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break;

                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break;

                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break;

            }

            ghost.prevCollision = []

        }
            //console.log(collisions)

    })

}

animate()

function detectColision({circle, rectangle}) {

    const padding = Boundary.width/2 - circle.radius - 1

    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.height + rectangle.position.y + padding &&
        circle.position.x + circle.radius + circle.velocity.x  >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y  >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
        )

}

function hide() {

    playAgain.hidden = true
    win.hidden = true
    lose.hidden = true

}

function reset() {

    location.reload()

}


