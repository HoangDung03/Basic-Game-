function rectangularCollision(player, enermy) {
    return (
        player.attackBox.position.x + player.attackBox.width >= enermy.position.x &&
        player.attackBox.position.x <= enermy.position.x + enermy.width &&
        player.attackBox.position.y + player.attackBox.height >= enermy.position.y &&
        player.attackBox.position.y <= enermy.position.y + enermy.height
    )
}

function determineWinner(player, enermy, timerId) {
    clearTimeout(timerId)
    if (player.health == enermy.health) {
        document.querySelector('.tie').innerHTML = 'TIE'
    } else if (player.health > enermy.health) {
        document.querySelector('.tie').innerHTML = 'Player 1 win'
    } else if (player.health > enermy.health) {
        document.querySelector('.tie').innerHTML = 'Player 2 win'
    }
}

let timer = 100
let timerId
function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        document.querySelector('.tie').classList.add('display')
        determineWinner(player, enermy, timerId)
    }

}
