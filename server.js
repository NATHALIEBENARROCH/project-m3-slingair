"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // anything attributed to a req.params is from the endpoint address

  // // get all flight numbers
  // const allFlights = Object.keys(flights);
  // console.log(allFlights);
  // // is flightNumber in the array?
  // console.log("REAL FLIGHT: ", allFlights.includes(flightNumber));
  const seats = flights[flightNumber];
  res.status(200).json({ seats }); // seats are prepared and out for delivery
};

const handleBooking = (req, res) => {
  console.log(req.body);
  let data = req.body;
  let reservation = {
    id: String(Math.floor(Math.random() * 90000000) + 10000000),
    ...data,
  };
  // the spread operator will add all the other data to the reservations variable
  reservations.push(reservation);
  //or reservations.push(data);
  console.log(reservations);
  res.status(200).json({ info: reservation, status: 200 });
};
const handleReservation = (req, res) => {
  const { id } = req.params;

  const foundReservation = reservations.find((reservation) => {
    return reservation.id === id;
  });

  res.status(200).json({ foundReservation }); // send the found reservation
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })

  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights/:flightNumber", handleFlight)
  .get("/reservations/:id", handleReservation)
  .post("/users", handleBooking)
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
