import { animate, setBalanceField } from "./functions.js"

if (!localStorage.getItem('balance_lotto')) {
    localStorage.setItem('balance_lotto', 5000)
}

setBalanceField()

document.querySelector('.one').style.left = '5%'
document.querySelector('.two').style.left = '10%'
document.querySelector('.three').style.right = '7%'
document.querySelector('.four').style.right = '15%'

animate('.button')