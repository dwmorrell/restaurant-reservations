const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;

};

async function resExists(req, res, next) {

  const resId = req.params.reservation_id;
  const data = await service.read(resId);

  if (!data) {
    return next({ status: 404, message: `Reservation: ${resId} does not exist.` });
  }

  res.locals.reservation = data;

  return next();

};

function validRes(req, res, next) {

  if (!req.body.data) {
    return next({ status: 400, message: `Data is missing.`})
  }

  const reservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people
  } = req.body.data);

  const errorArray = [];
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;

  if (!reservation.first_name || reservation.first_name === '') {
    errorArray.push('first_name');
  }

  if (!reservation.last_name || reservation.last_name === '') {
    errorArray.push('last_name');
  }

  if (!reservation.mobile_number || reservation.mobile_number === '') {
    errorArray.push('mobile_number');
  }

  if (!reservation.reservation_date || !reservation.reservation_date.match(dateFormat)) {
    errorArray.push('reservation_date');
  }

  if (!reservation.reservation_time || !reservation.reservation_time.match(timeFormat)) {
    errorArray.push('reservation_time');
  }

  if (!reservation.people || (typeof reservation.people) !== 'number') {
    errorArray.push('people');
  }

  if (reservation.status === 'seated') {
    errorArray.push('This reservation has already been seated.')
  }

  if (reservation.status === 'finished') {
    errorArray.push('This reservation has already finished.')
  }

  if (reservation.status === 'cancelled') {
    errorArray.push('This reservation has been cancelled.')
  }

  if (errorArray.length === 0) {
    res.locals.reservation = reservation;
    return next();
  }

  return next({ status: 400, message: `One or more inputs are invalid: ${errorArray.join(", ")}` });

};

function validFuture(req, res, next) {

  const errorArray = [];
  const currentDate = asDateString(new Date());
  let [ currentYear, currentMonth, currentDay ] = currentDate.split('-');

  currentYear = Number(currentYear);
  currentMonth = Number(currentMonth);
  currentDay = Number(currentDay);

  const resDate = res.locals.reservation.reservation_date;
  let [ reservationYear, reservationMonth, reservationDay ] = resDate.split('-');

  reservationYear = Number(reservationYear);
  reservationMonth = Number(reservationMonth);
  reservationDay = Number(reservationDay);

  resDateObj = new Date(resDate);
  const day = resDateObj.getDay() +1;

  if (day === 2) {
    errorArray.push('Restaurant is closed on Tuesdays');
  }

  // Check for reservation dates in the past

  if (reservationYear < currentYear) {
    errorArray.push(`Your reservation must be made for the current ${currentYear} year.`);
  } else if (reservationYear === currentYear && reservationMonth < currentMonth) {
    errorArray.push(`Your reservation must be made during the current ${currentMonth} month.`);
  } else if (reservationMonth === currentMonth && reservationDay < currentDay) {
    errorArray.push(`Your reservation must be made on the current day or a day in the future.`);
  } else if (reservationMonth === currentMonth && reservationDay === currentDay) {
    res.locals.today = true;
  }

  if (errorArray.length === 0) {
    return next();
  }

  return next({ status: 400, message: `One or more date inputs are invalid: ${errorArray.join(", ")}` });

};

function validStatus(req, res, next) {

  const errorArray = [];

  const currentStatus = res.locals.reservation.status;
  const newStatus = req.body.data.status;

  if (currentStatus === 'finished') {
    errorArray.push('This reservation is finished a cannot be updated.')
  } else if (newStatus !== 'booked' && newStatus !== 'seated' && newStatus !== 'finished' && newStatus !== 'cancelled') {
    errorArray.push('This reservation has an unknown or invalid status.')
  }

  if (errorArray.length === 0) {
    return next();
  }

  return next({ status: 400, message: `A status input is invalid: ${errorArray}` });

};

function validTime(req, res, next) {

  const errorArray = [];

  // in mintues
  // 630 = (10 x 60) + 30 -> 10:30 
  const reservationsOpen = 630;

  // 1290 = (21 x 60) + 30 -> 21:30 
  const reservationsClose = 1290;

  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  // convert current time to mintues
  const currentTimeInMin = (currentHours * 60) + currentMinutes;
  const reservationTime = res.locals.reservation.reservation_time;
  let [ reservationHour, reservationMinute ] = reservationTime.split(":");

  reservationHour = Number(reservationHour);
  reservationMinute = Number(reservationMinute);

  // convert reservation time to mintues
  const reservationTimeInMin = (reservationHour * 60) + reservationMinute;

  if(reservationTimeInMin < reservationsOpen) {
    errorArray.push(`The restaurant does not open before 10:30 AM.  Please select another time.`);
  } else if(reservationTimeInMin > reservationsClose) {
    errorArray.push(`No reservations after 9:30 PM, the restaurant closes at 10:30 PM`);
  } else if(res.locals.today && reservationTimeInMin < currentTimeInMin) {
    errorArray.push(`The selected time has already passed, please pick a time in the future.`);
  }
  
  if (errorArray.length === 0) {
    return next();
  }

  return next({ status: 400, message: `A time input is invalid: ${errorArray}` });

};

async function create(req, res) {

  const newRes = res.locals.reservation;
  const createdRes = await service.create(newRes);

  res.status(200).json({ data: createdRes });

};

async function edit(req, res) {

  let resId = req.params.reservation_id;
  resId = Number(resId);
  const editedRes = req.body.data;

  const updatedRes = await service.edit(resId, editedRes);

  res.status(200).json({ data: updatedRes[0] });

};

async function list(req, res) {

  if (req.query.date) {
    const { date } = req.query;
    let data = [];
    data = await service.list(date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const { mobile_number } = req.query;
    let data = [];
    data = await service.search(mobile_number);
    res.json({ data });
  }

}

function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

async function updateStatus(req, res) {
  let resId = req.params.reservation_id;
  resId = Number(resId);

  const newStatus = req.body.data.status;

  const updatedReservation = await service.updateStatus(resId, newStatus);

  res.status(200).json({ data: updatedReservation[0] });
}

module.exports = {
  create: [validRes, validFuture, validTime, asyncErrorBoundary(create)],
  edit: [asyncErrorBoundary(resExists), validRes, validFuture, validTime, asyncErrorBoundary(edit)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(resExists), read],
  update: [asyncErrorBoundary(resExists), validStatus, asyncErrorBoundary(updateStatus)],
};