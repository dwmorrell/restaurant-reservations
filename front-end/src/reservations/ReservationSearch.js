import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert.js";
import { useHistory } from "react-router-dom";
import { cancelReservation, searchReservation } from "../utils/api.js";

/**
* Defines the ReservationSearch function
*/
function ReservationSearch() {

    const history = useHistory();

    // useState functions
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [mobileNumber, setMobileNumber] = useState("");

    /**
    * Cancel reservation handler with confirmation window warning
    * Calls the cancelReservation API
    * @param {event}
    */
    const handleCancelReservation = async function (event) {
        event.preventDefault();
        const reservation_id = event.target.value;

        try {
            const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
            if (result) {
                await cancelReservation(reservation_id);
                history.go(-1);
            }
        } catch(error) {
            setReservationsError(error);
        }
    }

    /**
     * Handler for changes to the form field
     * @param {event} 
     */
    const handleChange = function (event) {
        setMobileNumber(event.target.value);
    }

    /**
     * Submit handler to find reservation
     * Calls the searchReservation API
     * @param {event}
     */
    const handleSearchSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            let data = await searchReservation(mobileNumber, abortController.signal);
            setReservations(data)
        } catch(error) {
            setReservationsError(error);
            return () => abortController.abort();
        }
	};

    return (
        <div>
            <h1>Search for a Reservation</h1>
            <form
                onSubmit={handleSearchSubmit}
            >
                <label>
                    Use a phone number to find reservation.
                </label>
                <br />
                <input 
                    name="mobile_number"
                    onChange={handleChange}
                    placeholder="Enter a phone number"
                    size="30"
                    type="text"
                    value={mobileNumber}
                />
                <button 
                    className="btn btn-primary ml-2" 
                    type="submit"
                >
                    Search
                </button> 
            </form>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile #</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th># of People</th>
                        <th>Status</th>
                        <th>Seat?</th>
                        <th>Edit?</th>
                        <th>Cancel?</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length === 0 ? ""
                    : reservations.map((reservation) => 
                        <tr key={reservation.reservation_id}>
                            <td>{reservation.first_name}</td>
                            <td>{reservation.last_name}</td>
                            <td>{reservation.mobile_number}</td>
                            <td>{reservation.reservation_date}</td>
                            <td>{reservation.reservation_time}</td>
                            <td>{reservation.people}</td>
                            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                            <td>
                                {/* Displays the Seat button */}
                                {reservation.status === "booked" ?                             
                                    <a href={`/reservations/${reservation.reservation_id}/seat`}>
                                        <button className="btn btn-secondary ml-2">
                                            Seat
                                        </button>
                                    </a>
                                : ""}
                            </td>
                            <td>
                                {/* Displays the Edit button */}
                                {reservation.status === "booked" ?                             
                                    <a href={`/reservations/${reservation.reservation_id}/edit`}>
                                        <button className="btn btn-primary ml-2">
                                            Edit
                                        </button>
                                    </a>
                                : ""}
                            </td>
                            <td>
                                {/* Displays the Cancel button */}
                                {reservation.status === "booked" ?                             
                                    <button 
                                        className="btn btn-danger ml-2"
                                        data-reservation-id-cancel={reservation.reservation_id}
                                        onClick={handleCancelReservation}
                                        value={reservation.reservation_id}
                                    >
                                        Cancel
                                    </button>
                                : "" }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {reservations.length === 0 ? 
                <h2>No reservations found</h2> 
            : "" }
            <ErrorAlert error={reservationsError} />
        </div>
    );

}

export default ReservationSearch;