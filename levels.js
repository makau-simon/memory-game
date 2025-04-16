const levelData = [
  { level: 1, cards: 4, cost: 0 },
  { level: 2, cards: 8, cost: 450 },
  { level: 3, cards: 12, cost: 650 },
  { level: 4, cards: 16, cost: 850 },
  { level: 5, cards: 20, cost: 1050 },
  { level: 6, cards: 24, cost: 1250 },
  { level: 7, cards: 28, cost: 1450 },
  { level: 8, cards: 32, cost: 1650 }
]

let diamonds = JSON.parse(localStorage.getItem("diamonds") || "0")

let unlockedLevels = JSON.parse(localStorage.getItem("unlockedLevels") || "[1]")

document.querySelectorAll(".diamonds").forEach(El => El.textContent = `💎${diamonds}`)

const levelsContainer = document.querySelector("#levels-container")


levelData.forEach(({ level, cards, cost }) => {
  unlockedLevels = JSON.parse(localStorage.getItem("unlockedLevels") || "[1]")
  const btn = document.createElement("button")
  
  btn.classList.add("btn-level")
  
  btn.innerHTML = unlockedLevels.includes(level) ? `Level ${level}` : `Level ${level} <br> 💎${cost}`
  
  btn.classList.add(unlockedLevels.includes(level) ? "unlocked" : "locked")
  
  if (unlockedLevels.includes(level)) {
    btn.onclick = () => {
      localStorage.setItem("currentLevel", JSON.stringify({ level, cards }))
      hideStartDialog()
      startGame()
    }
  }
  
  if (!unlockedLevels.includes(level)) {
    btn.onclick = () => {
      diamonds = JSON.parse(localStorage.getItem("diamonds") || "0")
      unlockedLevels = JSON.parse(localStorage.getItem("unlockedLevels") || "[1]")
      if (diamonds >= cost) {
        if (!unlockedLevels.includes(level - 1)) {
          gameAudio('assets/audio/notification.wav').play()
          document.querySelector("#unlock-info").textContent = `Unlock the previous level before you proceed!`
          document.querySelector("#not-enough-coins").showModal()
          document.querySelector("#ok-btn").onclick = () => {
            document.querySelector("#not-enough-coins").close()
          }
          return
        }
        
        unlockedLevels.push(level)
        if (unlockedLevels.includes(level)) {
          localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels))
        }
        gameAudio('assets/audio/levelunlocked.wav').play()
        let balance = diamonds - cost
        diamonds = localStorage.setItem("diamonds",JSON.stringify(balance))
        document.querySelectorAll(".diamonds").forEach(El => El.textContent = `💎${JSON.parse(localStorage.getItem("diamonds"))}`)
        btn.classList.add(unlockedLevels.includes(level) ? "unlocked" : "locked")
        btn.innerHTML = unlockedLevels.includes(level) ? `Level ${level}` : `Level ${level} <br> 💎${cost}`
        btn.onclick = () => {
          localStorage.setItem("currentLevel", JSON.stringify({ level, cards }))
          hideStartDialog()
          startGame()
        }
        
      } else {
        gameAudio('assets/audio/notification.wav').play()
        document.querySelector("#unlock-info").textContent = `Not enough diamonds to unlock this level!`
        document.querySelector("#not-enough-coins").showModal()
        document.querySelector("#ok-btn").onclick = () => {
          document.querySelector("#not-enough-coins").close()
        }
      }
    }
  }
  
  levelsContainer.appendChild(btn)
})