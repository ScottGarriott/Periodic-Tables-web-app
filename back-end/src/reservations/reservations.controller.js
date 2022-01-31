const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
/**
 * List handler for reservation resources
 */

 async function doesReservationExist(req, res, next) {

  const {reservation_id} = req.params 
  const reservation = await reservationsService.read(reservation_id)
  if(reservation){
    res.locals.reservation = reservation 
    return next()
  }
  next({
    status: 404,
    message:`Reservation at reservation id ${reservation_id} does not exist`
  })
}

function queryConfirmation(req, res, next) {
  const { mobile_number } = req.query
  const { date } = req.query
  if(mobile_number && mobile_number.length > 0){
    res.locals.mobile_number = mobile_number
    return next()
  }
  if(date){
    res.locals.date = date
    return next()
  }
  next({
    status: 400,
    message: "Mobile number or date required"
  })
}


function timeValidation(req, res, next) {
  const  { reservation_time }  = req.body.data
  if(reservation_time > "10:00" && reservation_time < "21:30"){
    return next()
  }
  next({
    status: 400,
    message: "Restaurant is closed between 10:30 pm and 10:30 am, reservation_time cannot be after 9:30pm"
  })
}

function doesRequestHaveData(req, res, next) {
  const {data} = req.body
  if(data){
    return next()
  }
  next({
    status: 400,
    message: "Request must include data"
  })
}

function dateCannotBeTuesday(req, res, next) {
  const { data: { reservation_date } } = req.body
  const dayNumber = new Date(reservation_date)
  if(dayNumber.getUTCDay() !== 2){
    return next()
  }
  next({
    status: 400,
    message: "Restaurant is closed on Tuesday"
  })
}

function dateMustBeAfterYesterday(req, res, next) {
  const { data: { reservation_date, reservation_time } } = req.body
  const reservationDateObject = new Date(`${reservation_date}T${reservation_time}:00`)
  const today = new Date()
  if(reservationDateObject >= today){
    return next()
  }
  next({
    status: 400,
    message: "reservation_date must be in the future"
  })
}


function doesReservatinHaveFirstName(req, res, next) {
  const { data: {first_name} } = req.body
  if(first_name && first_name !== ""){
    return next()
  }
  next({
    status: 400,
    message: "Reservation must include a first_name"
  })
}

function doesReservatinHaveLastName(req, res, next) {
  const { data: {last_name} } = req.body
  if(last_name && last_name !== ""){
    return next()
  }
  next({
    status: 400,
    message: "Reservation must include a last_name"
  })
}

function doesReservatinHaveMobileNumber(req, res, next) {
  const { data: {mobile_number} } = req.body
  if(mobile_number && mobile_number !== ""){
    return next()
  }
  next({
    status: 400,
    message: "Reservation must include a mobile_number"
  })
}

function doesReservatinHaveReservationDate(req, res, next) {
  const { data: {reservation_date} } = req.body
  const format = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
  if(reservation_date && format.test(reservation_date)){
    return next()
  }
  next({
    status: 400,
    message: "Reservation must include a reservation_date with the correct format."
  })
}

function doesReservatinHaveReservationTime(req, res, next) {
  const { data: {reservation_time} } = req.body
  const format = new RegExp("^[0-9]{2}:[0-9]{2}$")
  if(reservation_time && format.test(reservation_time)){
    return next()
  }
  next({
    status: 400,
    message: "Reservation must include a reservation_time with the correct format."
  })
}

function doesReservatinHavePeople(req, res, next) {
  const { data: { people } } = req.body
  if(people && Number.isFinite(people)){
    return next()
  }
  next({
    status: 400,
    message: "Reservation must include a number of people in the correct format"
  })
}

function checkAndAddStatusForCreateRequest(req, res, next) {
  const { status } = req.body.data
  if(status){
    return next()
  }
  req.body.data = {
    ...req.body.data,
    status: "booked"
  }
  return next()
}

function reservationStatusMustBeBooked(req, res, next) {
  const { data: { status } } = req.body
  if(status && status === "booked"){
    return next()
  }
  next({
    status: 400,
    message: `Reservation cannot be made with a status of ${status} `
  })
}

function checkReservationStatusForUpdateRequest(req, res, next) {
  const { status } = res.locals.reservation
  if(status && status !== "finished") {
    return next()
  }
  next({
    status: 400,
    message: `Reservation cannot be updated with ${status} status`
  })
}

function checkUpdatedReservationStatusForUpdateRequest(req, res, next) {
  const { status } = req.body.data
  if(status && (status === "finished" || status === "booked" || status === "seated" || status === "cancelled")) {
    return next()
  }
  next({
    status: 400,
    message: `Reservation cannot be updated with ${status} status`
  })
}

async function create(req, res, next) {
  const { data } = req.body
  const response = await reservationsService.create(data)
  res.status(201).json({ data: response })
}

async function list(req, res, next) {
  const date = res.locals.date
  const mobile_number = res.locals.mobile_number
  if(date){
  const data = await reservationsService.list(date)
  res.json({ data })
  }else if(mobile_number){
    const data = await reservationsService.search(mobile_number)
    res.json({ data })
  }else{
    throw new Error;
  }
}

function read(req, res, next) {
  const data = res.locals.reservation
  res.json({ data })
}

async function update(req, res, next) {
  const  updatedReservation = req.body.data
  const oldReservation = res.locals.reservation
  const newReservation = {
      ...oldReservation,
      ...updatedReservation
  }
  const response = await reservationsService.update(newReservation)
  res.status(200).json({ data: response })
}

module.exports = {

  list: [
    queryConfirmation, 
    asyncErrorBoundary(list)],

  create: [ 
    doesRequestHaveData, 
    timeValidation,
    dateCannotBeTuesday, 
    dateMustBeAfterYesterday, 
    doesReservatinHaveFirstName, 
    doesReservatinHaveLastName,
    doesReservatinHaveMobileNumber,
    doesReservatinHaveReservationDate,
    doesReservatinHaveReservationTime,
    doesReservatinHavePeople,
    checkAndAddStatusForCreateRequest,
    reservationStatusMustBeBooked,
    asyncErrorBoundary(create)],

  read:[
    asyncErrorBoundary(doesReservationExist), read],

  updateStatus: [
    asyncErrorBoundary(doesReservationExist),
    checkReservationStatusForUpdateRequest,
    checkUpdatedReservationStatusForUpdateRequest,
    asyncErrorBoundary(update)],

  update: [
    asyncErrorBoundary(doesReservationExist),
    doesRequestHaveData, 
    timeValidation,
    dateCannotBeTuesday, 
    dateMustBeAfterYesterday, 
    doesReservatinHaveFirstName, 
    doesReservatinHaveLastName,
    doesReservatinHaveMobileNumber,
    doesReservatinHaveReservationDate,
    doesReservatinHaveReservationTime,
    doesReservatinHavePeople,
    asyncErrorBoundary(update)],
};