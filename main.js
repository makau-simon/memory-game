const cardsContainer = document.querySelector("#container")

const startDialog = document.querySelector("#start-dialog")

const statusInfoHeading = document.querySelector("#status-info")

const numberOfCards = document.querySelector("#number-of-cards")

const startGameBtn = document.querySelector("#start-game-btn")

const wrongMoves = document.querySelector("#wrong-moves")


function hideStartDialog() {
  startDialog.classList.add("hide")
}

function showStartDialog() {
  startDialog.classList.remove("hide")
}

startGameBtn.addEventListener("click", () => {
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
        card.classList.add("correct");
        hideOtherCards();
        nextNumber++;
      }
      
      else if (num === nextNumber) {
        card.classList.remove("hidden");
        card.classList.add("correct");
        nextNumber++;
        if (nextNumber > numberCards) {
          cardsContainer.innerHTML = ""
          showStartDialog()
          statusInfoHeading.textContent = "You win,play again!"
        }
      } else {
        wrongClicks++
        wrongMoves.textContent = `${wrongClicks}/5`
        if (wrongClicks == 5) {
          cardsContainer.innerHTML = ""
          showStartDialog()
          statusInfoHeading.textContent = "You loose,Try again!"
          wrongMoves.textContent = `0/5`
          
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