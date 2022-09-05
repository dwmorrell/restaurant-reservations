import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm.js";
import { useParams } from "react-router-dom";
import { findReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, formatAsTime } from "../utils/date-time";

/**
 * Defines the EditReservation page.
 */
function EditReservation() {

    const resId = useParams().reservation_id;
    
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

    /**
    * useEffect function to search for and load into state the requested reservation for editing
    * Calls the findReservation API
    */
    useEffect(() => {
        const abortController = new AbortController();
        setReservationsError(null);
        findReservation(resId, abortController.signal)
            .then(setReservation)
            .catch(setReservationsError);
        return () => abortController.abort();
    }, [resId]);
 
    return (
        <div>
            <ErrorAlert error={reservationsError} />
            <ReservationForm edit={true} foundReservation={reservation} />
        </div>
    );

}

export default EditReservation;