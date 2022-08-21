import React from "react";


import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";


// Import forms for specific routes
import CreateReservation from "../reservations/CreateReservation.js";
import CreateTable from "../tables/CreateTable.js";
import EditReservation from "../reservations/EditReservation.js";
import ReservationSeat from "../reservations/ReservationSeat.js";
import ReservationSearch from "../reservations/ReservationSearch.js";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Routes() {


  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation  />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation  />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat  />
      </Route>
      <Route path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/search">
        <ReservationSearch />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable  />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;