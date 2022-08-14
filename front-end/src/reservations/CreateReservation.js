import React from "react";
import ReservationForm from "./ReservationForm.js";

function CreateReservation() {

    return (
        <div>
            <ReservationForm props={{ isNew: true }}/>
        </div>
    );

}

export default CreateReservation;