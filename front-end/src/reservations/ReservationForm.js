import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, editReservation } from "../utils/api";
import { today, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert.js";

function ReservationForm( {foundReservation, edit, loadReservation} ) {
    
    
    edit ? edit = true : edit = false;


    // useState functions
    const[error, setError] = useState(null);
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: today(),
        reservation_time: formatAsTime(new Date().toTimeString()),
        people: 1
    });

    const history = useHistory();

    // useEffect functions
    useEffect(() => {
        if(edit && foundReservation) {
            setReservation(foundReservation);
        }
    }, [edit, foundReservation]);

     /**
     * Handler for submit function
     * @param {event}
     */
	const handleSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            if(edit && validateFields()) {
                    let result = await editReservation(reservation, abortController.signal);
                    let reservationDate = result.reservation_date;
                    history.push(`/dashboard?date=${reservationDate}`);
            } else {
                    let result = await createReservation(reservation, abortController.signal);
                    let reservationDate = result.reservation_date;
                    history.push(`/dashboard?date=${reservationDate}`);
                    await loadReservation();
            }
        } catch(error) {
            setError(error);
            return () => abortController.abort();
        }
	};

    function validateFields() {

        let foundErrors = [];

        if (typeof(reservation.people) !== "number") {
            reservation.people = Number(reservation.people);
        }
        for (const field in reservation) {
          if (reservation[field] === "") {
            foundErrors.push({
              message: `${field.split("_").join(" ")} cannot be left blank.`,
            });
          }
        }
        setError(foundErrors);
        return foundErrors.length === 0;
      }

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
                            <th colSpan="2">
                                {!edit ? 
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