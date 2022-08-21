import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm.js";
import { useParams } from "react-router-dom";
import { findReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, formatAsTime } from "../utils/date-time";

function EditReservation() {

    const { reservation_id } = useParams();
    // useState functions
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: today(),
        reservation_time: formatAsTime(new Date().toTimeString()),
        people: 1
    });
    const [reservationsError, setReservationsError] = useState(null);

    // useEffect functions

    useEffect(() => {
        const abortController = new AbortController();
        setReservationsError(null);
        findReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setReservationsError);
        return () => abortController.abort();
    }, [reservation_id]);
 
    return (
        <div>
            <ErrorAlert error={reservationsError} />
            <ReservationForm edit={true} foundReservation={reservation} />
        </div>
    );

}

export default EditReservation;