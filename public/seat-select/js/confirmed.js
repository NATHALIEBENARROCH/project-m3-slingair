console.log(document.location);
console.log(window.location);

const url = new URL(window.location.href);
const params = url.searchParams;
const id = params.get("id");
console.log(id);

console.log(params);

fetch(`/reservations/${id}`) ///request the item
  .then((res) => {
    return res.json();
  }) ////delivery of item and unboxing of item
  .then((data) => {
    //// result of delivery and unpacking. Item from box.
    console.log(data);
    let reservation = data.foundReservation;
    console.log(reservation);
    document.getElementById("flight").innerText = reservation.flight;
    document.getElementById("seat").innerText = reservation.seat;
    document.getElementById("name").innerText =
      reservation.givenName + " " + reservation.surname;
    document.getElementById("email").innerText = reservation.email;
  });
