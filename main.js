const cardsContainer = document.querySelector("#container")

const homeBtn = document.querySelector("#home-btn")

const gameMessage = document.querySelector("#message")

const displayScoreEl = document.querySelector("#display-score")

const timeTaken = document.querySelector("#time-taken")

const retryBtn = document.querySelector("#retry-btn")

const startDialog = document.querySelector("#start-dialog")

const showGameInfoDialog = document.querySelector("#show-game-info")

const startGameBtn = document.querySelector("#start-game-btn")

const wrongMoves = document.querySelector("#wrong-moves")

const wrongMovesElement = document.querySelector(".wrong-moves")

const minutesEl = document.querySelector("#minutes")
const secondsEl = document.querySelector("#seconds")

const quitBtn = document.querySelector("#quit")

let { level, cards } = JSON.parse(localStorage.getItem("currentLevel")) || { level: 1, cards: 4 }


function hideQuitBtn() {
  quitBtn.classList.add("hide")
}

function handleWrongMovesEl(action) {
  if (action == "hide") {
    wrongMovesElement.classList.add("hide")
  } else {
    wrongMovesElement.classList.remove("hide")
  }
}


hideQuitBtn()
handleWrongMovesEl('hide')

const welcomeScreen = document.querySelector("#welcome-screen")

const progressBar = document.querySelector("#bar")

let barValue = 0
let timerInterval
let minutes = 0
let seconds = 0
let lives = 5
let score
window.startGame


let timerId = setInterval(() => {
  barValue += 10
  progressBar.value = barValue
  if (barValue == 100) {
    clearInterval(timerId)
    welcomeScreen.classList.add("hide")
  }
}, 200)

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++
    secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds
    
    if (seconds >= 60) {
      seconds = 0
      minutes++
      minutesEl.textContent = minutes < 10 ? `0${minutes}` : minutes
    }
    
  }, 500)
}


function displayDialog(dialogBox) {
  dialogBox.showModal()
}

function hideDialog(dialogBox) {
  dialogBox.close()
}

function hideStartDialog() {
  startDialog.classList.add("hide")
}

function showStartDialog() {
  startDialog.classList.remove("hide")
}

function gameAudio(audio) {
  let gameaudio = new Audio()
  gameaudio.src = `${audio}`
  return gameaudio
}

function resetWrongMoves() {
  wrongMoves.textContent = `❤️ X 5`
}

quitBtn.addEventListener("click", () => {
  cardsContainer.innerHTML = ""
  minutes = 0
  seconds = 0
  lives = 5
  secondsEl.textContent = "00"
  minutesEl.textContent = "00"
  showStartDialog()
  clearInterval(timerInterval)
  resetWrongMoves()
  hideQuitBtn()
  cardsContainer.innerHTML = ""
  handleWrongMovesEl('hide')
})

function resetGame() {
  minutes = 0
  seconds = 0
  lives = 5
  resetWrongMoves()
  secondsEl.textContent = "00"
  minutesEl.textContent = "00"
  startGame()
  hideDialog(showGameInfoDialog)
}

retryBtn.addEventListener("click", resetGame)

homeBtn.addEventListener("click", () => {
  minutes = 0
  seconds = 0
  lives = 5
  hideDialog(showGameInfoDialog)
  showStartDialog()
  secondsEl.textContent = "00"
  minutesEl.textContent = "00"
})

startGame = () => {
  let { level, cards } = JSON.parse(localStorage.getItem("currentLevel")) || { level: 1, cards: 4 }
  
  handleWrongMovesEl('show')
  quitBtn.classList.remove("hide")
  gameAudio('assets/audio/startbtn.wav').play()
  
  let nextNumber = 1
  let cardsArray = []
  
  hideStartDialog()
  
  const numbers = Array.from({ length: 32 }, (_, i) => i + 1)
  
  const shuffled = numbers.sort(() => Math.random() - 0.5)
  
  shuffled.forEach(num => {
    const card = document.createElement("div")
    card.classList.add("tile")
    card.textContent = num
    card.dataset.number = num
    cardsContainer.appendChild(card)
    cardsArray.push(card)
    let validCards = Array.from({ length: cards }, (_, i) => i + 1)
    if (!validCards.includes(num)) {
      card.classList.add("other")
    }
  })
  
  cardsArray.forEach(card => {
    card.addEventListener("click", () => {
      const num = parseInt(card.dataset.number);
      
      if (nextNumber === 1 && num === 1) {
        startTimer()
        gameAudio('assets/audio/correct.wav').play()
        
        card.classList.add("correct")
        
        hideOtherCards()
        
        nextNumber++
      }
      
      else if (num === nextNumber) {
        gameAudio('assets/audio/correct.wav').play()
        card.classList.remove("hidden");
        card.classList.add("correct");
        nextNumber++;
        if (nextNumber > cards) {
          calculateScore(minutes, seconds, lives)
          cardsContainer.innerHTML = ""
          gameAudio('assets/audio/wining.wav').play()
          resetWrongMoves()
          updateGameInfo(true)
          displayDialog(showGameInfoDialog)
          hideQuitBtn(true)
          handleWrongMovesEl('hide')
        }
      } else {
        gameAudio('assets/audio/wrong.wav').play()
        lives--
        wrongMoves.textContent = `❤️ X ${lives}`
        if (lives == 0) {
          cardsContainer.innerHTML = ""
          gameAudio('assets/audio/gameover.wav').play()
          resetWrongMoves()
          hideQuitBtn()
          handleWrongMovesEl('hide')
          updateGameInfo(false)
          displayDialog(showGameInfoDialog)
        }
      }
    })
  })
  
  function hideOtherCards() {
    cardsArray.forEach(c => {
      if (parseInt(c.dataset.number) !== 1) {
        c.classList.add("hidden");
      }
    })
  }
}


function calculateScore(minutes, seconds, wrongMoves) {
  clearInterval(timerInterval)
  if (seconds <= 20) {
    score = (20 - seconds) + lives
    saveScore(score)
  } else {
    score = 5 + lives
    saveScore(score)
  }
}


function saveScore(score) {
  let oldScore = JSON.parse(localStorage.getItem("diamonds") || "0")
  let newScore = oldScore + score
  localStorage.setItem("diamonds", JSON.stringify(newScore))
  displayScore()
}

function displayScore() {
  document.querySelectorAll(".diamonds").forEach(El => El.textContent = `💎${JSON.parse(localStorage.getItem("diamonds") || "0")}`)
}

function updateGameInfo(gameWon) {
  if (gameWon) {
    gameMessage.textContent = "Congratulations 🎉 You win!"
    timeTaken.textContent = `You took ${minutes} minutes ${seconds} seconds`
    displayScoreEl.textContent = `💎 X ${score}`
  } else {
    clearInterval(timerInterval)
    gameMessage.textContent = "sorry 😭You lose!"
    timeTaken.textContent = "try again!"
    displayScoreEl.textContent = `💎 X 0`
  }
}