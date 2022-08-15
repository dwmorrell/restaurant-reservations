import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm.js";
import { useParams } from "react-router-dom";
import { findReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {

    const reservation_id = useParams().reservation_id;
    // useState functions
    const [reservation, setReservation] = useState({});
    const [reservationsError, setReservationsError] = useState(null);

    // useEffect functions
    useEffect(function (reservation_id) {

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
            <ReservationForm 
                props={ {isNew: false, passedReservation: reservation} } 
            />
        </div>
    );

}

export default EditReservation;