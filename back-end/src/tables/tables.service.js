const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name", "asc")
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({table_id})
        .first()
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdTable) => createdTable[0])
}

function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id})
        .update(updatedTable, "*")
        .then((updatedRecords) => updatedRecords[0])
}


function seat(updatedTable, reservation_id) {
    return knex.transaction(function(trx) {
        return trx("reservations")
            .select("*")
            .where({reservation_id: reservation_id})
            .first()
            .update({status: "seated"})
            .then((updatedRecords) => updatedRecords[0])
            .then( () =>{ 
            return trx("tables")
            .select("*")
            .where({ table_id: updatedTable.table_id})
            .update(updatedTable, "*")
            .then((updatedRecords) => updatedRecords[0])})
    })
}

function finish(updatedTable, reservation_id){
  return  knex.transaction(function(trx) {
        return  trx("reservations")
             .select("*")
             .where({reservation_id: reservation_id})
             .first()
             .update({status: "finished"})
             .then((updatedRecords) => updatedRecords[0])
             .then( () => {
            return trx("tables")
             .select("*")
             .where({ table_id: updatedTable.table_id})
             .update(updatedTable, "*")
             .then((updatedRecords) => updatedRecords[0])})
 
         
     })
}

module.exports = {
    list,
    create,
    read,
    update,
    seat,
    finish
}