/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  //process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  process.env.NODE_ENV === "production" ? "https://git.heroku.com/periodic-tables-7447-back-end.git" : "http://localhost:5000"

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {

  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function readReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`)
  return await fetchJson(
    url, 
    {
     headers,
     method: "GET",
     signal },
      []
      )
    .then(formatReservationDate)
    .then(formatReservationTime)
}


/**
 Retrievs all existing tables.
 */

export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  return await fetchJson(
    url, 
    { 
    headers,
    method: "GET",
    signal
     },
     []
  )
}


/**
 * Posts new reservation to database
 */

export async function createReservations(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;

  const response =  await fetchJson(
    url,
    {
      body: JSON.stringify({ data: {
        ...reservation
      } }),
      headers,
      method: "POST",
      signal
    },
    []
  )
  .then(formatReservationDate)
  .then(formatReservationTime)



  return response
}

/**
 * Creates a new Table
 * @param {*} table 
 * Table object to be sent to api 
 * @param {*} signal 
 * abort controller signal
 * @returns 
 * a promise containing the returned data from the post request
 */

export async function createTables(table, signal) {

  const url = `${API_BASE_URL}/tables`;

  return await fetchJson(
    url,
    {
      body: JSON.stringify({ data: table }),
      headers,
      method: "POST",
      signal
    },
    []
  )
}

/**
 * 
 * @param {*} table_id
 * a table id taken from the selection in the webpage 
 * @param {*} reservation_id 
 * the reservation id that will be added to the table object
 * @param {*} signal 
 * abort controller signal
 * @returns 
 * a promise containing the returned updated table
 */

export async function seatReservation(table_id, reservation_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  return await fetchJson(
    url,
    {
      body: JSON.stringify({ data: {reservation_id: reservation_id} }),
      headers,
      method: "PUT",
      signal
    }
  )
}

/**
 * 
 * @param {*} table_id
 * a table id taken from the table card in the webpage 
 * @param {*} reservation_id 
 * the reservation id that will be updated in the table object
 * @param {*} signal 
 * abort controller signal
 * @returns 
 * a promise containing the returned updated table
 */

 export async function finishTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  return await fetchJson(
    url,
    {
      headers,
      method: "DELETE",
      signal
    }
  )
}

/**
 * 
 * @param {*} updatedReservation
 * an object containing data which contains updated reservtion
 * @param {*} reservation_id 
 * the id of the reservation to be updated
 * @param {*} signal 
 * abort controller signal
 * @returns 
 * a promise containing the updated reservation
 */

export async function updateReservationStatus(reservation_id, updatedReservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  return await fetchJson(
    url,
    {
      body: JSON.stringify({ data: {...updatedReservation} }),
      headers,
      method: "PUT",
      signal
    }
  )
}

/**
 * 
 * @param {*} reservation_id
 * the id of the reservation to be updated 
 * @param {*} updatedReservation 
 * an object containing data which contains updated reservation
 * @param {*} signal 
 * abort controller signal
 * @returns 
 * a promise containing the updated reservation
 */

export async function updateReservation(
  reservation_id, 
  updatedReservation, 
  signal) {

  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(
    url,
    {
      body: JSON.stringify({ data: {...updatedReservation} }),
      headers,
      method: "PUT",
      signal
    },
    []
  )
  .then(formatReservationDate)
  .then(formatReservationTime)
}

/**
 * 
 * @param {*} mobile_phone
 * a mobile number passed to the url  
 * @param {*} signal 
 * abort controller signal
 * @returns 
 * a promise containing the resulting reservations
 */

export async function searchReservations(mobile_phone, signal) {
  const url = `${API_BASE_URL}/reservations?mobile_number=${mobile_phone}`
  return await fetchJson(
    url,
    {
      headers,
      method: "GET",
      signal
    }
  )
  .then(formatReservationDate)
  .then(formatReservationTime)
}