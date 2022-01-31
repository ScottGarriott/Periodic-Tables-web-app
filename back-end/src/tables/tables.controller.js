const tablesService = require("./tables.service")
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//get reservation for update endpoint

function doesRequestHaveReservationId(req, res, next) {
    const {reservation_id} = req.body.data
    if(reservation_id){
        return next()
    }
    next({
        status: 400,
        message: "Request requires reservation_id"
    })
}

async function readReservation(req, res, next) {
    const { reservation_id } = req.body.data
    const reservation = await reservationService.read(reservation_id)
    if(reservation){
        res.locals.reservation = reservation
        return next()
    }
    next({
        status: 404,
        message: `Reservation at reservation id ${reservation_id} does not exist`
    })
}

async function doesTableExist(req, res, next) {
    const {table_id} = req.params
    const table = await tablesService.read(table_id)
    if(table){
        res.locals.table = table
        return next()
    }
    next({
        status: 404,
        message: `Table at table id ${table_id} does not exist`
    })

}

function doesRequestHaveData(req, res, next) {
    const {data} = req.body
    if(data){
        return next()
    }
    next({
        status: 400,
        message: "Request requires data"
    })
}

function isTableOccupied(req, res, next) {
    const table = res.locals.table
    if(table.reservation_id){
        return next()
    }
    next({
        status: 400,
        message:"Table is not occupied"
    })
}

function isTableUnoccupied(req, res, next) {
    const table = res.locals.table
    if(!table.reservation_id){
        return next()
    }
    next({
        status: 400,
        message:"Table is occupied"
    })
}

function areThereEnoughSeats(req, res, next) {
    const table = res.locals.table
    const reservation = res.locals.reservation
    if(table.capacity >= reservation.people){
        return next()
    }
    next({
        status: 400,
        message: "Not enough capacity at table to seat party"
    })
}

function doesTableHaveName(req, res, next) {
    const {table_name} = req.body.data
    if(table_name && table_name.length > 1){
        return next()
    }
    next({
        status: 400,
        message: "Table requires table_name in the correct format"
    })
}

function doesTableHaveCapacity(req, res, next) {
    const {capacity} = req.body.data
    if(capacity && Number.isFinite(capacity) && capacity > 0){
        return next()
    }
    next({
        status: 400,
        message: "Table requires capacity in the correct format"
    })
}

function isReservationSeated(req, res, next) {
    const { status } = res.locals.reservation
    console.log("ISRESERVATIONSEATED", res.locals.reservation)
    if(status !== "seated") {
        return next()
    }
    next({
        status: 400,
        message: "Reservation already seated"
    })
}

async function list(req, res, next) {
    const data  = await tablesService.list()
    res.status(200).json({ data })
}

function read(req, res, next) {
    const data = res.locals.table
    res.status(200).json({ data })
}

async function create(req, res, next) {
    const { data } = req.body
    const tableWithReservationId = {
        ...data,
        reservation_id: 0
    }
    const response = await tablesService.create(data)
    res.status(201).json({ data: response })
}


async function update(req, res, next) {
    const { reservation_id } = req.body.data
    const oldTable = res.locals.table
    const newTable = {
        ...oldTable,
        reservation_id: reservation_id
    }
    const response = await tablesService.update(newTable)
    res.status(200).json({ data: response })
}

async function finish(req, res, next) {
    const oldTable = res.locals.table
    const newTable = {
        ...oldTable,
        reservation_id: 0
    }
    const response = await tablesService.finish(newTable, oldTable.reservation_id)
    res.status(200).json({ data: response })
}

async function seat(req, res, next) {
    const { reservation_id } = req.body.data
    const oldTable = res.locals.table
    const newTable = {
        ...oldTable,
        reservation_id: reservation_id
    }
    const response = await tablesService.seat(newTable, reservation_id)
    res.status(200).json({ data: response })
}


module.exports = {
    list: asyncErrorBoundary(list),

    create: [
        doesRequestHaveData,
        doesTableHaveName, 
        doesTableHaveCapacity, 
        asyncErrorBoundary(create)],

    read: [
        asyncErrorBoundary(doesTableExist), 
        read],

    seat: [
        doesRequestHaveData,
        doesRequestHaveReservationId,
        asyncErrorBoundary(readReservation), 
        asyncErrorBoundary(doesTableExist),
        isReservationSeated,
        isTableUnoccupied,
        areThereEnoughSeats,
        asyncErrorBoundary(seat)],

    finish: [
        asyncErrorBoundary(doesTableExist),
        isTableOccupied,
        asyncErrorBoundary(finish)]
}