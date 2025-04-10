const cardsContainer = document.querySelector("#container")

const startDialog = document.querySelector("#start-dialog")

const statusInfoHeading = document.querySelector("#status-info")

const numberOfCards = document.querySelector("#number-of-cards")

const startGameBtn = document.querySelector("#start-game-btn")

const wrongMoves = document.querySelector("#wrong-moves")

const quitBtn = document.querySelector("#quit")

function hideQuitBtn() {
  quitBtn.classList.add("hide")
}

hideQuitBtn()

const welcomeScreen = document.querySelector("#welcome-screen")

const progressBar = document.querySelector("#bar")

let barValue = 0

let timerId = setInterval(() => {
  barValue += 10
  progressBar.value = barValue
  if (barValue == 100) {
    clearInterval(timerId)
    welcomeScreen.classList.add("hide")
  }
}, 200)


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

quitBtn.addEventListener("click", () => {
  cardsContainer.innerHTML = ""
  showStartDialog()
  statusInfoHeading.textContent = "Try again!"
  wrongMoves.textContent = `0/5`
  hideQuitBtn()
})

startGameBtn.addEventListener("click", () => {
  quitBtn.classList.remove("hide")
  gameAudio('assets/startbtn.wav').play()
  let numberCards = numberOfCards.value
  
  hideStartDialog()
  
  let wrongClicks = 0
  let nextNumber = 1
  let cards = []
  
  const numbers = Array.from({ length: numberCards }, (_, i) => i + 1)
  
  const shuffled = numbers.sort(() => Math.random() - 0.5)
  
  shuffled.forEach(num => {
    const card = document.createElement("div")
    card.classList.add("tile")
    card.textContent = num
    card.dataset.number = num
    cardsContainer.appendChild(card)
    cards.push(card)
  })
  
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const num = parseInt(card.dataset.number);
      
      if (nextNumber === 1 && num === 1) {
        
        gameAudio('assets/correct.wav').play()
        
        card.classList.add("correct");
        hideOtherCards();
        nextNumber++;
      }
      
      else if (num === nextNumber) {
        gameAudio('assets/correct.wav').play()
        card.classList.remove("hidden");
        card.classList.add("correct");
        nextNumber++;
        if (nextNumber > numberCards) {
          cardsContainer.innerHTML = ""
          showStartDialog()
          gameAudio('assets/wining.wav').play()
          wrongMoves.textContent = `0/5`
          statusInfoHeading.textContent = "You win,play again!"
          hideQuitBtn()
        }
      } else {
        gameAudio('assets/wrong.wav').play()
        wrongClicks++
        wrongMoves.textContent = `${wrongClicks}/5`
        if (wrongClicks == 5) {
          cardsContainer.innerHTML = ""
          showStartDialog()
          gameAudio('assets/gameover.wav').play()
          statusInfoHeading.textContent = "You loose,Try again!"
          wrongMoves.textContent = `0/5`
          hideQuitBtn()
        }
      }
    })
  })
  
  function hideOtherCards() {
    cards.forEach(c => {
      if (parseInt(c.dataset.number) !== 1) {
        c.classList.add("hidden");
      }
    });
  }
  
  
})