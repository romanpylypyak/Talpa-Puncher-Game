let body = document.querySelector("body")
let playBtn = document.querySelector(".play")
let playerName = document.querySelector("#player-name")
let gameMode = document.querySelector("#game-mode")
let gameCells = document.querySelectorAll(".game-cell")
let winnerModal = document.querySelector(".winner-modal-window")
let winnerField = document.querySelector(".winner-field")
let closeWinnerModal = document.querySelector(".winner-modal-close")
let closeLeaderboardModal = document.querySelector(".leaderboard-modal-close")
let leaderboard = document.querySelector(".winners")
let leaderboardModal = document.querySelector(".leaderboard-window")
let leaderboardContent = document.querySelector(".leaderboard-content")
let deleteLeaderboard = document.querySelector(".delete-leaderboard")

let player
let computer
let prevRandom = []


document.addEventListener('DOMContentLoaded', function() {
    sendAJAX("")
});


function unicRandom() {
    if (prevRandom.length > 16) { return false }
    let min = 0
    let max = 16
    let rand = Math.floor(Math.random() * (max - min + 1)) + min

    if (prevRandom.includes(rand)) {
        rand = Math.floor(Math.random() * (max - min + 1)) + min
        checkNum()

        function checkNum() {
            if (prevRandom.includes(rand)) {
                rand = Math.floor(Math.random() * (max - min + 1)) + min
                checkNum()
            } else {
                return rand
            }
        }
    }
    prevRandom.push(rand)
    return rand
}

playBtn.onclick = function() {
    if (playerName.value === "") {
        playerName.value = "Unknown user"
    }
    player = 0
    computer = 0
    playBtn.disabled = true
    playerName.disabled = true
    let gameLevel = gameMode.value
    talpaShowing(gameLevel)
}

function talpaShowing(level) {
    let currentGameSpeed = null
    switch (level) {
        case "1":
            currentGameSpeed = 800
            break;
        case "2":
            currentGameSpeed = 700
            break;
        case "3":
            currentGameSpeed = 600
            break;
        default:
            break;
    }

    function cellShow() {
        gameCells.forEach((el) => {
            el.classList.remove("blue")
        })
        let randomCell = unicRandom()
        gameCells.forEach((el, index) => {
            if (index === randomCell) {
                el.classList.add("blue")
                setTimeout(() => {
                    el.classList.remove("blue")
                    if (!el.classList.contains("green")) {
                        el.classList.add("red")
                        computer++
                    }
                }, currentGameSpeed)
                countWinner(player, computer, showInteval)
            }
        })

        gameCells.forEach((el) => {
            el.onclick = function(e) {
                if (e.target.classList.contains("blue")) {
                    e.target.classList.remove("blue")
                    e.target.classList.add("green")
                    player++
                    countWinner(player, computer, showInteval)
                }
            }
        })
        if (prevRandom.length > 16) {
            setTimeout(() => {
                winnerModal.classList.add("active")
                winnerField.innerHTML = "DRAW!"
                clearInterval(showInteval);
                return false
            }, 0);
        }
    }
    let showInteval = setInterval(() => cellShow(), currentGameSpeed)
}

leaderboard.onclick = function() {
    leaderboardModal.classList.add("active")
}
deleteLeaderboard.onclick = function() {
    deleteDBRequest()
}

closeLeaderboardModal.onclick = () => leaderboardModal.classList.remove("active")

closeWinnerModal.onclick = function() {
    winnerModal.classList.remove("active")
    gameCells.forEach((el) => {
        el.classList.remove("blue", "green", "red")
        prevRandom = []
    })
    playBtn.disabled = false
}

function countWinner(player, computer, showInteval) {
    if (player > 8) {
        clearInterval(showInteval);
        sendAJAX(playerName.value)
        setTimeout(() => {
            winnerModal.classList.add("active")
            winnerField.innerHTML = playerName.value + " Win!"
            playerName.disabled = false
            return false
        }, 1000)
    }
    if (computer > 8) {
        clearInterval(showInteval);
        sendAJAX("Computer")
        setTimeout(() => {
            winnerModal.classList.add("active")
            winnerField.innerHTML = "Computer Win!"
            playerName.disabled = false
            return false
        }, 1000)
    }
}


function sendAJAX(winner) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("post", "../server/index.js", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    if (winner === "") {
        xhttp.send()
    } else {
        let data = {
            "winner": winner,
            "Date": moment().format()
        }
        xhttp.send(JSON.stringify(data))
    }

    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            result(this.responseText)
        }
    }

    function result(data) {
        let parseData = JSON.parse(data)
        let content = ""
        for (let i = 0; i < parseData.length; i++) {
            content += (`<div class="winnerInfo"><p>${parseData[i].winner}</p><p>${parseData[i].date}</p></div>`)
        }
        leaderboardContent.innerHTML = content
    }
}


function deleteDBRequest() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', "../server/index.js", true);
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            result(this.responseText)
        };
    }
    xhttp.send();

    function result(data) {
        let parseData = JSON.parse(data)
        let content = ""
        for (let i = 0; i < parseData.length; i++) {
            content += (`<div class="winnerInfo"><p>${parseData[i].winner}</p><p>${parseData[i].date}</p></div>`)
        }
        leaderboardContent.innerHTML = content
    }
}