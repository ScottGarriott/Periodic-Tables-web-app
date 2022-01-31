const knex = require("../db/connection")



//= dateTime.today() possible way to get current date for dashboard
//is default date necessary here or can it be handled somewhere else
//would want a warning if no date is given

function read(reservation_id){
    return knex("reservations")
        .select("*")
        .where({reservation_id})
        .first()
}

function list(date) {
    return knex("reservations")
            .select("*")
            .where({reservation_date: date})
            .whereNot("status", "finished") 
            .orderBy("reservation_time", "asc")
}


function create(reservation) {
    // const reservationWithStatus = {
    //     ...reservation,
    //     status: "booked"
    // }
    return knex("reservations")
            .insert(reservation)
            .returning("*")
            .then((createdReservations) => createdReservations[0])
}

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .first()
        .update(updatedReservation, "*")
        .then((updatedRecords) => updatedRecords[0])
}

function search(mobile_number) {
       return knex("reservations")
        .select("*")
        .whereRaw(
           "translate(mobile_number, '() -', '') like ?",
           `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
     }

module.exports = {
    list,
    create,
    read,
    update,
    search
}