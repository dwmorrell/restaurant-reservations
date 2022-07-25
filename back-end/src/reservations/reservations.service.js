const knex = require("../db/connection");

const list = () => {
    return knex("reservations").select("*");
  }

const read = (resId) => {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: resId })
    .first();
}


  module.exports = {
    list,
    read,
  }