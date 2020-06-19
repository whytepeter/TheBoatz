// Boat constructor
class Boat {
  constructor(
    name,
    boatNumber,
    isAvailable = true,
    price = 0,
    startTime,
    returnTime
  ) {
    this.name = name
    this.boatNumber = boatNumber
    this.isAvailable = isAvailable
    this.price = price
    this.startTime = startTime
    this.returnTime = returnTime
  }
}

// Data class
class Logic {
  static report() {
    return {
      totalBaotsHired: 0,
      totalHours: 0,
      totalMoney: 0,
    }
  }

  static updateReport(newMoney, newHours, newBoatHired) {
    const report = Logic.report()
    report.totalMoney += newMoney
    report.totalHours += newHours
    report.totalBaotsHired += newBoatHired

    console.log(Logic.report())
    return report
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

  static updateBoatInfo(hiredBoat, price, hireTime, returnTime) {
    Logic.allBoats().forEach((boat) => {
      if (boat.name === hiredBoat.name) {
        boat.isAvailable = false
        boat.price = price
        boat.startTime = hireTime
        boat.returnTime = returnTime
      }
    })

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

  static getReturnTime(startHour) {
    let returnHour = parseInt(startHour) + hour
    switch (returnHour) {
      case 13:
        returnHour = 1
        break
      case 14:
        returnHour = 2
        break
      case 15:
        returnHour = 3
        break
      case 16:
        returnHour = 4
        break
      case 17:
        returnHour = 5
        break
      default:
        returnHour
    }

    let returnTime = `${returnHour}:${min}${sec}`
    return returnTime
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

        let price = Logic.getPrice(hour)
        if (price.isTrue) {
          boatPrice = price.mainPrice
          const timeHired = timer()
          const returnTime = Logic.getReturnTime(hour)
          // update boat logic info
          selectedBoat.isAvailable = false
          selectedBoat.price = boatPrice
          selectedBoat.startTime = timeHired
          selectedBoat.returnTime = returnTime
          Logic.updateBoatInfo(selectedBoat, boatPrice, timeHired, returnTime)

          //update the ui info
          UI.updateBoatInfo(selectedBoat)

          //update Report Info
          Logic.updateReport(boatPrice, hour, 1)
          UI.updateReportUI(Logic.report())

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
    <p class="info-title">Hired Time: <span >${hiredBoat.startTime}</span></p>
    <p class="info-title">Return Time: <span  >${
      hiredBoat.returnTime
    }</span></p>
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

  //update theReport info
  static updateReportUI(report) {
    let infoList = document.querySelector(".info-left")

    const html = `
    <p class="info-title info-title--main">Full Report</p>
        <p class="info-title">Number Boats of Hired: <span id="total-boat-hire">${report.totalBaotsHired}</span></p>
        <p class="info-title">Total Number of Hours: <span id="total-hour">${report.totalHours}hr</span></p>
        <p class="info-title">End of Day Money: <span id="total-money">$${report.totalMoney}</span></p>
    `

    //append new report to HTMl
    infoList.innerHTML = html

    //add display class
    infoList.classList.add("display")
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
let endTime = 17
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
