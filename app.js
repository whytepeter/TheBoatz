// Boat constructor
class Boat {
  constructor(name, boatNumber, isAvailable = true, price = 0, returnTime) {
    this.name = name
    this.boatNumber = boatNumber
    this.isAvailable = isAvailable
    this.price = price
    this.returnTime = returnTime
  }
}

// Data class
class Logic {
  static report() {
    let totalBaotsHired = 0
    let totalHours = 0
    let totalMoney = 0
  }

  static allBoats() {
    let boatsArray = [
      "boat-1",
      "boat-2",
      "boat-3",
      "boat-4",
      "boat-5",
      "boat-6",
      "boat-7",
      "boat-8",
      "boat-9",
      "boat-10",
    ]
    //New Array of all boat with properties
    const boats = boatsArray.map((boat) => {
      let getNumber = boat.split("-")
      let number = parseInt(getNumber[1])

      boat = new Boat(boat, number, true, 0, null)

      return boat
    })

    return boats
  }

  static getAvailableBoats() {
    const boats = Logic.allBoats().filter((boat) => boat.isAvailable === true)

    return boats
  }

  static updateBoatInfo(hiredBoat, price, hour) {
    Logic.allBoats().forEach((boat) => {
      if (boat.name === hiredBoat.name) {
        boat.isAvailable = false
        boat.price = price
        boat.returnTime = hour
      }
    })
    Logic.allBoats()
    Logic.getAvailableBoats()
    console.log(Logic.allBoats())
  }
  static checkAvailability(name) {
    let select, isTrue, message
    isTrue = false
    //loop through all available boats
    const boats = Logic.getAvailableBoats()
    select = boats.find((boat) => boat.name === name)
    if (select) {
      message = `${name} is avaialbe for hire`
      isTrue = true
    } else {
      isTrue = false
      message = `${name} is not available for hire`
      UI.alert("error", message)
    }

    return {
      isTrue,
      select,
      message,
    }
  }

  static getPrice(hour) {
    let mainPrice, isTrue, message

    if (hour === "1/2") {
      mainPrice = 12
      isTrue = true
    } else {
      hour = parseInt(hour)

      if (hour <= 0 || hour > hoursLeft()) {
        isTrue = false
        message = `Hore hours must be greater 0 and less than max hour`
      } else {
        if (hour >= 1) {
          isTrue = true
          mainPrice = hour * 20
        }
      }
    }

    return {
      mainPrice,
      isTrue,
      message,
    }
  }

  static hireBoat() {
    let name, check, hour, boatPrice, selectedBoat
    name = prompt("Boat Name")
    //check availability of the boat
    if (name) {
      check = Logic.checkAvailability(name)
      selectedBoat = check.select
      if (check.isTrue) {
        console.log(check.message)
        //get the price
        hour = prompt(`Max hour = ${hoursLeft()}, Min hour = 1/2`)
        if (hour) {
          let price = Logic.getPrice(hour)
          if (price.isTrue) {
            boatPrice = price.mainPrice

            // update boat logic info
            selectedBoat.isAvailable = false
            selectedBoat.price = boatPrice
            selectedBoat.returnTime = hour

            Logic.updateBoatInfo(selectedBoat, boatPrice, hour)

            //update the ui info
            UI.updateBoatInfo(selectedBoat)

            console.log(`${name} has been hired for $${boatPrice}`)
            UI.alert("success", `${name} has been hired for $${boatPrice}`)
          } else {
            console.log(price.message)
            UI.alert("error", price.message)
          }
        }
      }
    }
  }
}

// console.log(Data.getAvailableBoats())

//Ui class
class UI {
  static AvailableBoat() {
    document.getElementById(
      "available"
    ).textContent = Logic.getAvailableBoats().length
  }

  static updateBoatInfo(hiredBoat) {
    const boatList = document.querySelector(".boat-info")
    const boatsEl = Array.from(document.querySelectorAll(".boat"))
    const infoEl = document.querySelector(".info")

    let id
    id = hiredBoat.boatNumber
    const html = `<li id="${id}" >
    <p class="info-title">Name : <span >${hiredBoat.name.toUpperCase()}</span></p>
    <p class="info-title">Return Time: <span  >${
      hiredBoat.returnTime
    }hr</span></p>
    <p class="info-title">Amount Paid <span id="">$${hiredBoat.price}</span></p>
  </li>`

    boatList.innerHTML += html

    //disable unavailable boat
    boatsEl.forEach((boat) => {
      if (boat.id == id) {
        boat.classList.add("notAvailable")
      }
    })

    //check if info doen't the class of display before adding
    if (!infoEl.className.includes("display")) {
      infoEl.classList.add("display")
    }

    //update boats available count
    UI.AvailableBoat()
  }
  static alert(type, message) {
    const alerts = Array.from(document.querySelectorAll(".alerts"))
    alerts.forEach((alert) => {
      if (type === alert.id) {
        alert.textContent = message
        // clear message if its an error after 7 seconds
        if (type !== "alert") {
          setTimeout(() => {
            alert.textContent = ""
          }, 7000)
        }
      }
    })
  }
}

//Events

//show the available boats count
UI.AvailableBoat()

//Timer function
//get hours left
const hoursLeft = () => {
  return Math.floor(endTime - hour)
}

let hour = 10
let endTime = 18
let min = 0
let sec = 0
const timer = () => {
  let sign = document.querySelector(".sign")
  let time = `${hour} : ${min}${sec}`
  sec++

  //update minutes
  if (sec == 9) {
    min++
    sec = 0
  }
  //update hour
  if (min == 6) {
    hour++
    min = 0
  }
  // 12 hours timer
  if (hour == 13) {
    sign.textContent = "PM"
    hour = 1
    endTime = 5
  }
  // start the timer back when the end day reaches
  if (hour == endTime) {
    hour = 10
    min = 0
    sign.textContent = "AM"
    startBtn.classList.remove("start-day")
  }
  return time
}

//Start Day
const start = () => {
  //start timer
  setInterval(() => {
    document.querySelector(".time").textContent = timer()
  }, 500)

  // hireboat event
  const btn = document.getElementById("hire")
  btn.addEventListener("click", () => {
    Logic.hireBoat()
  })
}

//start the day
let startBtn = document.querySelector(".start")
startBtn.addEventListener("click", () => {
  start()
  startBtn.classList.add("start-day")
})
