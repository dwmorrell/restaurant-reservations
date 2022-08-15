import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Reservation({reservations}) {

    const history = useHistory();

    // useState function
    const [error, setError] = useState(null);

    // Cancel function handler
    const handleCancelReservation = async function (event) {
        event.preventDefault();
        const reservation_id = event.target.value;

        try {
            const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
            if (result) {
                await cancelReservation(reservation_id);
                history.go();
            }
        } catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            <ErrorAlert error={error} />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile #</th>
                        <th>Time</th>
                        <th># of People</th>
                        <th>Status</th>
                        <th>Seat?</th>
                        <th>Edit?</th>
                        <th>Cancel?</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => 
                        reservation.status === "finished" ? "" : 
                            <tr key={reservation.reservation_id}>
                                <td> {reservation.first_name} </td>
                                <td> {reservation.last_name} </td>
                                <td> {reservation.mobile_number} </td>
                                <td> {reservation.reservation_time}</td>
                                <td> {reservation.people}</td>
                                <td data-reservation-id-status={reservation.reservation_id}> {reservation.status} </td>
                                <td>
                                    {/* Displays the Seat button */}
                                    {reservation.status === "booked" ?                             
                                        <a href={`/reservations/${reservation.reservation_id}/seat`}>
                                            <button className="btn btn-primary ml-2">
                                                Seat
                                            </button>
                                        </a>
                                    : ""}
                                </td>
                                <td>
                                    {/* Displays the edit button */}
                                    {reservation.status === "booked" ?                             
                                        <a href={`/reservations/${reservation.reservation_id}/edit`}>
                                            <button className="btn btn-primary ml-2">
                                                Edit
                                            </button>
                                        </a>
                                    : ""}
                                </td>
                                <td>
                                    {/* Displays the cancel button */}
                                    {reservation.status === "booked" ?                             
                                        <button 
                                            className="btn btn-primary ml-2"
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
        </div>
    );
}

export default Reservation;