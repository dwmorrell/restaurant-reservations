import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, editReservation } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert.js";

function ReservationForm( {props} ) {

    const isNew = props.isNew;

    // useState functions
    const[error, setError] = useState(null);
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    });

    const history = useHistory();

    // useEffect functions
    useEffect(() => {
        if(!isNew && props.passedReservation.first_name) {
            setReservation(props.passedReservation);
        }
    }, [isNew, props.passedReservation]);

     /**
     * Handler for submit function
     * @param {event}
     */
	const handleSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            if(isNew) {
                let result = await createReservation(reservation, abortController.signal);
                let reservationDate = result.reservation_date;
                history.push(`/dashboard?date=${reservationDate}`);
            } else {
                let result = await editReservation(reservation, abortController.signal);
                let reservationDate = result.reservation_date;
                await props.loadReservation();
                history.push(`/dashboard?date=${reservationDate}`);
            }
        } catch(error) {
            setError(error);
            return () => abortController.abort();
        }
	};

    /**
     * Handler for changes to various fields
     * @param {target} param0 
     */
    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.name === "people" ? Number(target.value) : target.value,
        });
    };

    return (
        <div>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">
                                {isNew ? 
                                <h1>Make a Reservation</h1>
                                : <h1>Edit a Reservation</h1> }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <label>
                                    First Name
                                </label>
                            </td>
                            <td>
                                <label>
                                    Last Name
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input 
                                    id="firstName"
                                    name="first_name"
                                    onChange={handleChange}
                                    type="text"
                                    value={reservation.first_name}
                                />
                            </td>
                            <td>
                                <input 
                                    id="lastName"
                                    type="text"
                                    name="last_name"
                                    onChange={handleChange} 
                                    value={reservation.last_name}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    Mobile Number
                                </label>
                            </td>
                            <td>
                                <label>
                                    Number of People in Party
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input 
                                    id="mobileNumber"
                                    name="mobile_number"
                                    onChange={handleChange} 
                                    value={reservation.mobile_number}
                                />
                            </td>
                            <td>
                                <input 
                                    id="partyPeople"
                                    name="people" 
                                    onChange={handleChange}
                                    value={reservation.people}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    Date of Reservation
                                </label>
                            </td>
                            <td>
                                <label>
                                    Time of Reservation
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input 
                                    id="reservationDate"
                                    type="date"
                                    name="reservation_date" 
                                    onChange={handleChange}
                                    value={reservation.reservation_date}
                                    placeholder="YYYY-MM-DD" 
                                    pattern="\d{4}-\d{2}-\d{2}"
                                />
                            </td>
                            <td>
                                <input 
                                    id="reservationTime"
                                    type="time" 
                                    name="reservation_time" 
                                    onChange={handleChange}
                                    value={reservation.reservation_time}
                                    placeholder="HH:MM" 
                                    pattern="[0-9]{2}:[0-9]{2}"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button 
                                    className="btn btn-primary ml-2" 
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-secondary" 
                                    
					                onClick={(event) => {
						                event.preventDefault();
						                history.go(-1);
					                }}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form> 
        </div>
    );

}

export default ReservationForm;