const flightInput = document.getElementById("flights");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

let selection = "";

const renderSeats = (seats) => {
  seatsDiv.innerHTML = "";
  document.querySelector(".form-container").style.display = "block";

  let seatsObj = {};
  seats.forEach((seat) => {
    seatsObj[seat.id] = seat;
  });
  console.log("Converted to seats object: ", seatsObj);

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      // we must go through flight seating data FOR chosen flight and assciate that data with seats generated
      // then we check if seat is occupied or available
      // then we set if seat available or occupied to be rendered to inner html

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      if (seatsObj[seatNumber].isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }

      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    console.log(seat);
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = async (event) => {
  const flightNumber = flightInput.value;
  console.log("toggleFormContent: ", flightNumber);
  await fetch(`/flights/${flightNumber}`) ///request the item
    .then((res) => {
      return res.json();
    }) ////delivery of item and unboxing of item
    .then((data) => {
      //// result of delivery and unpacking. Item from box.
      // console.log(data);
      renderSeats(data.seats);
    });

  // TODO: contact the server to get the seating availability

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  //prevent refreshing
  //fetch below will  send info to back end through request method :post and request body

  fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      flight: flightInput.value,
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      seat: selection,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        console.log(data.info);
        window.location.href = `/seat-select/confirmed.html?id=${data.info.id}`;
      }
    });
};

flightInput.addEventListener("change", toggleFormContent);
