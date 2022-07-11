import { activateAudio, changeBalance, randInt, setBalanceField, shuffle } from "./functions.js"

setBalanceField()
activateAudio()

let wheel = document.querySelector('.wheel')
let green = document.querySelector('.green')
let balance = document.querySelector('.balance')
let wrapper = document.querySelector('.wrapper')
let warning = document.querySelector('.warning')

let ballCoords = [[43, 90], [53, 89], [46.3, 83.25], [62, 86.5],
[71, 81.5], [64, 79], [55, 80], [37, 84], [28, 86.5],
[16, 79], [23, 81], [84, 67], [79, 74.5],
[76, 66], [84, 32], [86, 43], [89, 36], [84, 52], [89.5, 49], [88, 58],
[86.5, 28], [75, 11.5], [45, 0], [57, 1.5], [26, 4.5], [37, 0.5], [32, 6], [65, 4.5], [81, 18],
[68, 11], [50, 6],
[0, 43], [6, 67], [10, 73], [16, 10.5], [22, 11], [10, 17], [7, 21], [2, 32], [1.5, 56], [4, 49],
[81, 26], [73, 20], [58, 11], [70, 72], [78, 59], [41, 8], [18, 20], [9, 29], [5, 38],
[9, 59], [14, 66], [17, 73], [30, 79], [17, 29],
[42, 77], [61, 72], [78, 38], [78, 46], [75, 27], [64, 18], [34, 14], [26, 17], [12, 38], [10, 46], [11, 53], [25, 73]
]

let lightCoords = [
    [21, -2], [31.5, -7], [42.5, -8.5], [26, -5], [37, -8],
    [76, 0], [65.5, -5], [71, -3]
]

let unluckyCoords = [
    [35, 8], [42, 8], [49, 8],
    [39, 17], [46, 17],
    [43, 25]
]

let luckyCoords = [
    [87, 8], [94, 8],
    [90, 17]
]

let flagData = [
    ['R', '#D02121'], ['B', '#25558C'], ['B', '#191A1C'], ['Y', '#F2BE1E'], ['G', '#087439']
]

let typeList = ['corners', 'line', 'diagonal', 'table']
let order = shuffle(Array.from({ length: 99 }, (v, i) => String(i + 1)))

let started = false
let active = true
let ticket = []
let mode = 'corners'

let ballsLeft = 25
let currentUnluckyCoords = 0
let currentLuckyCoords = 0
let currentBall = 0

wheel.style.height = wheel.clientWidth + 'px'

for (let i = 0; i < ballCoords.length; i++) {
    let ball = document.createElement('div')
    ball.classList.add('wheel_ball', 'ball_style_' + randInt(1, 6), 'block')
    ball.innerHTML = randInt(1, 99)

    ball.style.left = ballCoords[i][0] + '%'
    ball.style.top = ballCoords[i][1] + '%'
    ball.style.transform = 'rotate(' + randInt(1, 300) + 'deg)'

    wheel.appendChild(ball)
}

for (let i = 0; i < lightCoords.length; i++) {
    let light = document.createElement('div')
    light.classList.add('light', 'block')

    light.style.left = lightCoords[i][0] + '%'
    light.style.bottom = lightCoords[i][1] + '%'

    let innerLight = document.createElement('div')
    innerLight.classList.add('inner_light')

    let redInnerLight = document.createElement('div')
    redInnerLight.classList.add('red_light', 'hidden')

    light.append(redInnerLight, innerLight)
    wheel.appendChild(light)
}

for (let i = 0; i < 5; i++) {
    let flag = document.createElement('div')
    flag.classList.add('flag', 'block')

    flag.innerHTML = flagData[i][0]
    flag.style.backgroundColor = flagData[i][1]

    document.querySelector('.flag_cont').appendChild(flag)
}

for (let typeName of typeList) {
    let option = document.createElement('div')
    option.classList.add('option')
    option.innerHTML = typeName

    if (typeName == 'corners') {
        option.classList.add('chosen')
    }

    option.onclick = () => {
        if (!active || started) { return }

        for (let o of document.querySelectorAll('.option')) {
            o.classList.remove('chosen')
        }

        option.classList.add('chosen')
        mode = typeName
    }

    document.querySelector('.option_cont').appendChild(option)
}

setLights()
setGreen()
setTicket()

green.onclick = async () => {
    if (!active) { return }
    active = false

    if (!started) {
        if (Number(balance.innerHTML) < 350) { return }

        started = true
        setGreen('game')

        changeBalance(-350)
    }

    let num = order[currentBall]

    if (ticket.includes(num)) {
        await nextBall(num, luckyCoords[currentLuckyCoords])
        currentLuckyCoords++

        if (!luckyCoords[currentLuckyCoords]) {
            currentLuckyCoords = 0
        }

        ticket[ticket.indexOf(num)] = 0
        crossTicketCell(num)

        if (checkWin(mode)) {
            gameOver(3000)
            return
        }
    } else {
        await nextBall(num, unluckyCoords[currentUnluckyCoords])
        currentUnluckyCoords++

        if (!unluckyCoords[currentUnluckyCoords]) {
            currentUnluckyCoords = 0
        }
    }

    ballsLeft--
    document.querySelector('.left').innerHTML = ballsLeft

    if (!ballsLeft) {
        gameOver(0)
    }

    currentBall++
    active = true
}

document.querySelector('.again').onclick = () => {
    started = false
    active = true
    ticket = []

    ballsLeft = 25
    currentUnluckyCoords = 0
    currentLuckyCoords = 0
    currentBall = 0

    setGreen()
    setTicket()

    for (let ball of document.querySelectorAll('.ball')) {
        ball.remove()
    }

    document.querySelector('.left').innerHTML = ballsLeft
    warning.style.left = '-50%'
}

function setLights() {
    setInterval(() => {
        let r = randInt(0, lightCoords.length)

        for (let i = 0; i < lightCoords.length; i++) {
            if (i == r) {
                document.querySelectorAll('.red_light')[i].classList.remove('hidden')
            } else {
                document.querySelectorAll('.red_light')[i].classList.add('hidden')
            }
        }
    }, 200);
}

function setTicket() {
    document.querySelector('.ticket').innerHTML = ''

    ticket = shuffle(Array.from({ length: 99 }, (v, i) => String(i + 1))).slice(0, 25)

    for (let num of ticket) {
        let ticketBlock = document.createElement('div')
        ticketBlock.classList.add('ticket_block', 'block')
        ticketBlock.innerHTML = num
        document.querySelector('.ticket').appendChild(ticketBlock)
    }
}

function setGreen(type = 'start') {
    green.innerHTML = ''

    if (type == 'start') {
        let title = document.createElement('div')
        title.classList.add('green_title')
        title.innerHTML = 'buy<br>ticket'

        let img = document.createElement('img')
        img.src = '../png/currency.png'

        let price = document.createElement('div')
        price.classList.add('green_price')
        price.innerHTML = '350'

        green.append(title, img, price)
    } else {
        for (let word of ['get', 'next', 'ball']) {
            let wordDiv = document.createElement('div')
            wordDiv.classList.add('green_word')
            wordDiv.innerHTML = word

            green.appendChild(wordDiv)
        }
    }
}

function nextBall(num, coords) {
    let ball = document.createElement('div')
    ball.classList.add('ball', 'block', 'ball_style_' + randInt(1, 6))
    ball.innerHTML = num
    wrapper.appendChild(ball)

    setTimeout(() => {
        ball.style.bottom = '50%'
    }, 50);

    return new Promise((resolve) => {
        setTimeout(() => {
            ball.style.bottom = coords[1] + '%'
            ball.style.left = coords[0] + '%'

            resolve('ok')
        }, 600);
    })
}

function crossTicketCell(num) {
    for (let cell of document.querySelectorAll('.ticket_block')) {
        if (cell.innerHTML == num) {
            cell.classList.add('crossed')
        }
    }
}

function checkWin(type) {
    if (type == 'corners') {
        for (let i of [0, 4, 19, 24]) {
            if (ticket[i]) { return false }
        }

        return true
    }

    if (type == 'table') {
        for (let i = 0; i < 25; i++) {
            if (ticket[i]) { return false }
        }

        return true
    }

    if (type == 'diagonal') {
        let d = 2

        for (let i of [0, 6, 12, 18, 24]) {
            if (ticket[i]) {
                d--
                break
            }
        }

        for (let i of [4, 8, 12, 16, 20]) {
            if (ticket[i]) {
                d--
                break
            }
        }

        return Boolean(d)
    }

    if (type == 'line') {
        let l = 10

        for (let i = 0; i < 5; i++) {
            let row = true
            let col = true

            for (let j = 0; j < 5; j++) {
                if (ticket[i * 5 + j]) {
                    row = false
                }
                if (ticket[j * 5 + i]) {
                    col = false
                }
            }

            if (!row) { l-- }
            if (!col) { l-- }
        }

        return Boolean(l)
    }
}

function gameOver(reward) {

    if (reward) {
        changeBalance(reward)
        animateOnce('.balance')
    }

    warning.querySelector('.outcome').innerHTML = reward ? 'You win' : 'You lose'
    warning.querySelector('.reward').innerHTML = reward

    warning.style.left = '50%'
}

document.querySelector('.wrapper').classList.remove('hidden')