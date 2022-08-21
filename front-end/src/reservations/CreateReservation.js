import React from "react";
import ReservationForm from "./ReservationForm.js";

/**
 * Defines the CreateReservation page.
 */
function CreateReservation() {

    return (
        <div>
            <ReservationForm edit={false} />
        </div>
    );

}

export default CreateReservation;