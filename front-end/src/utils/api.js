import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001"
 //"https://restaurant-res-backend-app.herokuapp.com";


/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file
 *
 * @param url
 *  the url for the request
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error
 *  If the response is not in the 200 - 399 range the promise is rejected
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return null;
    }
    if (response.status === 404) {
      console.log("The response came back as a 404");
      console.log(response.text());
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
 * API calls for the "reservations" table in the database
 */

/**
 * Changes status of a reservation to "cancelled"
 * @param reservation_id 
 *  The reservation ID of the reservation to be cancelled
 * @param signal 
 * @returns 
 */
export async function cancelReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify( { data: { status: "cancelled" } } ),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Saves reservation to the database
 * There is no validation done on the reservation object, any object will be saved
 * @param reservation
 *  the reservation to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation, which will now have an `id` property
 */
 export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify( { data: reservation } ),
    signal,
  };
  return await fetchJson(url, options, reservation)
  .then(formatReservationDate)
  .then(formatReservationTime);
}

/**
 * Saves updated reservation details to the database
 * @param reservation
 *  the reservation that is to be updated
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database
 */
export async function editReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify( { data: reservation } ),
    signal,
  };
  return await fetchJson(url, options, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves reservation based on reservation_id.
 * @param reservation_id
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of the reservation saved in the database.
 */
export async function findReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options, {})    
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing reservations.
 * @param params
 * @param signal
 *  optional AbortController.signal
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

/**
 * Searches for any reservations that contain the given mobile number
 * @param mobile_number 
 * @param signal
 *  optional AbortController.signal
 * @returns 
 *  a promise that resolves a reservation that contains the mobile number
 */
export async function searchReservation(mobile_number, signal) {
  const url = `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * API calls for the "tables" table in the database
 */

/**
 * Removes a reservation_id from the table with the given table_id
 * @param table_id 
 * @param signal
 *  optional AbortController.signal 
 * @returns
 *   a promise that resolves the cleared table
 */
 export async function clearTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Saves table to the database.
 * There is no validation done on the table object, any object will be saved.
 * @param table
 *  the table to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves the saved table, which will now have an `id` property.
 */
 export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: table}),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves all existing tables.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of a table saved in the database.
 */
 export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);

  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Update table to seat a party at it.
 * There is no validation done on the table object, any object will be saved.
 * @param reservation_id
 *  the reservation ID # to be seated
 * @param table_id
 * the table ID # to be seat the reservation at
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves the updated table.
 */
 export async function seatReservation(reservation_id, table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify( { data: { reservation_id } } ),
    signal,
  };
  return await fetchJson(url, options, {});
}