const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const canvas = $('canvas')
const ctx = canvas.getContext('2d')
const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './assets/background.png'
})


const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    scale: 2.7,
    imgSrc: './assets/shop.png',
    framesMax: 6
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
}

var lastKey

canvas.width = 1024
canvas.height = 576

const player = new Fighter(
    {
        position: {
            x: 200,
            y: 0,
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'red',
        attackBox: {
            offset: {
                x: 120,
                y: 20
            },
            width: 100,
            height: 100,
        },
        imgSrc: './assets/samuraiMack/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x: 220,
            y: 150,
        },
        sprites: {
            idle: {
                imgSrc: './assets/samuraiMack/Idle.png',
                framesMax: 8
            },
            run: {
                imgSrc: './assets/samuraiMack/Run.png',
                framesMax: 8
            },
            jump: {
                imgSrc: './assets/samuraiMack/Jump.png',
                framesMax: 2
            },
            fall: {
                imgSrc: './assets/samuraiMack/Fall.png',
                framesMax: 2
            },
            attack1: {
                imgSrc: './assets/samuraiMack/Attack1.png',
                framesMax: 6
            },
            takeHit: {
                imgSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death: {
                imgSrc: './assets/samuraiMack/Death.png',
                framesMax: 6
            },
        }
    }
)

const enermy = new Fighter(
    {
        position: {
            x: 700,
            y: 0,
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'red',
        attackBox: {
            offset: {
                x: -150,
                y: 20
            },
            width: 100,
            height: 100,
        },
        imgSrc: './assets/kenji/Idle.png',
        framesMax: 4,
        scale: 2.5,
        offset: {
            x: 210,
            y: 160,
        },
        sprites: {
            idle: {
                imgSrc: './assets/kenji/Idle.png',
                framesMax: 4
            },
            run: {
                imgSrc: './assets/kenji/Run.png',
                framesMax: 8
            },
            jump: {
                imgSrc: './assets/kenji/Jump.png',
                framesMax: 2
            },
            fall: {
                imgSrc: './assets/kenji/Fall.png',
                framesMax: 2
            },
            attack1: {
                imgSrc: './assets/kenji/Attack1.png',
                framesMax: 4
            },
            takeHit: {
                imgSrc: './assets/kenji/Take hit.png',
                framesMax: 3
            },
            death: {
                imgSrc: './assets/kenji/Death.png',
                framesMax: 7
            },
        }
    }
)

decreaseTimer()

function gameLoop() {
    window.requestAnimationFrame(gameLoop)

    background.update()
    shop.update()
    player.update()
    enermy.update()

    player.velocity.x = 0
    enermy.velocity.x = 0
    // player movement
    if (keys.d.pressed) {
        player.velocity.x = 2
        player.switchSprite('run')
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -2
        player.switchSprite('run')
    } else if (keys.w.pressed && player.lastKey === 'w') {
        player.velocity.y = -10
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enermy movement
    if (keys.ArrowRight.pressed && enermy.lastKey === 'ArrowRight') {
        enermy.velocity.x = 2
        enermy.switchSprite('run')
    } else if (keys.ArrowLeft.pressed && enermy.lastKey === 'ArrowLeft') {
        enermy.velocity.x = -2
        enermy.switchSprite('run')
    } else if (keys.ArrowUp.pressed && enermy.lastKey === 'ArrowUp') {
        enermy.velocity.y = -10
    } else {
        enermy.switchSprite('idle')
    }

    if (enermy.velocity.y < 0) {
        enermy.switchSprite('jump')
    } else if (enermy.velocity.y > 0) {
        enermy.switchSprite('fall')
    }

    // detect for collition
    if (rectangularCollision(player, enermy) &&
        player.attacking && player.framesCurrent === 4
    ) {
        player.attacking = false
        enermy.takeHit()
        document.querySelector('#enermyHealth').style.width = `${enermy.health}%`
    } else if (rectangularCollision(enermy, player) &&
        enermy.attacking && enermy.framesCurrent === 2
    ) {
        enermy.attacking = false
        player.takeHit()
        document.querySelector('#playerHealth').style.width = `${player.health}%`
    }

    // end game by health
    if (player.health <= 0 || enermy.health <= 0) {
        document.querySelector('.tie').classList.add('display')
        determineWinner(player, enermy, timerId)
    }
}

gameLoop()

window.addEventListener('keydown', (event) => {
    if (!player.death)
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 's':
                keys.s.pressed = true
                player.lastKey = 's'
                break
            case 'w':
                keys.w.pressed = true
                player.lastKey = 'w'
                break
            case ' ':
                player.attack()
                break
        }
    if (!enermy.death)
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enermy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enermy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                keys.ArrowUp.pressed = true
                enermy.lastKey = 'ArrowUp'
                break
            case 'ArrowRight':
                keys.ArrowDown.pressed = true
                enermy.lastKey = 'ArrowRight'
                break
            case '1':
                enermy.attack()
                break
        }
})

// Tham chiếu đến các phần tử âm thanh
const jumpSound = document.getElementById('jumpSound');
const moveSound = document.getElementById('moveSound');
const attackSound = document.getElementById('attackSound');
// const backgroundSound = document.getElementById('backgroundSound');


// function playBackgroundSound(){
//     background.currentTime = 0;
//     background.play();
// }

// Các hàm để phát âm thanh
function playJumpSound() {
    jumpSound.currentTime = 1.5   ; // Quay lại từ đầu
    jumpSound.play();
}

function playMoveSound() {
    moveSound.currentTime = 3; // Quay lại từ đầu
    // moveSound.endTime =3;
    moveSound.play();
}

function playAttackSound() {
    attackSound.currentTime = 0; // Quay lại từ đầu
    attackSound.play();
}

// Cập nhật di chuyển của người chơi với âm thanh
function updatePlayerMovement() {
    player.velocity.x = 0;

    if (keys.d.pressed) {
        player.velocity.x = 2;
        player.switchSprite('run');
        playMoveSound();
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -2;
        player.switchSprite('run');
        playMoveSound();
    } else if (keys.w.pressed && player.lastKey === 'w') {
        player.velocity.y = -10;
        playJumpSound();
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
}

// Cập nhật di chuyển của kẻ thù với âm thanh
function updateEnermyMovement() {
    enermy.velocity.x = 0;

    if (keys.ArrowRight.pressed && enermy.lastKey === 'ArrowRight') {
        enermy.velocity.x = 2;
        enermy.switchSprite('run');
        playMoveSound();
    } else if (keys.ArrowLeft.pressed && enermy.lastKey === 'ArrowLeft') {
        enermy.velocity.x = -2;
        enermy.switchSprite('run');
        playMoveSound();
    } else if (keys.ArrowUp.pressed && enermy.lastKey === 'ArrowUp') {
        enermy.velocity.y = -10;
        playJumpSound();
    } else {
        enermy.switchSprite('idle');
    }

    if (enermy.velocity.y < 0) {
        enermy.switchSprite('jump');
    } else if (enermy.velocity.y > 0) {
        enermy.switchSprite('fall');
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    background.update();
    shop.update();
    player.update();
    enermy.update();

    updatePlayerMovement();
    updateEnermyMovement();

    // Phát hiện va chạm
    if (rectangularCollision(player, enermy) &&
        player.attacking && player.framesCurrent === 4
    ) {
        player.attacking = false;
        enermy.takeHit();
        document.querySelector('#enermyHealth').style.width = `${enermy.health}%`;
    } else if (rectangularCollision(enermy, player) &&
        enermy.attacking && enermy.framesCurrent === 2
    ) {
        enermy.attacking = false;
        player.takeHit();
        document.querySelector('#playerHealth').style.width = `${player.health}%`;
    }

    // Kết thúc game theo sức khỏe
    if (player.health <= 0 || enermy.health <= 0) {
        document.querySelector('.tie').classList.add('display');
        determineWinner(player, enermy, timerId);
    }
}

gameLoop();

window.addEventListener('keydown', (event) => {
    if (!player.death) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                keys.w.pressed = true;
                player.lastKey = 'w';
                break;
            case ' ':
                player.attack();
                playAttackSound();
                break;
        }
    }
    if (!enermy.death) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enermy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enermy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                keys.ArrowUp.pressed = true;
                enermy.lastKey = 'ArrowUp';
                break;
            case '1':
                enermy.attack();
                playAttackSound();
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
});




window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowDown.pressed = false
            break
    }
})