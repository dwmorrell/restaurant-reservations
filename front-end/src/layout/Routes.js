import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

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

  const query = useQuery();
  const date = query.get("date") || today();

  const [ reservations, setReservations ] = useState([]);
  const [ reservationsError, setReservationsError ] = useState(null);
  const [ tables, setTables ] = useState([]);
  const [ tablesError, setTablesError ] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);

    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then((tables) =>
        tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
      )
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }
  
  

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} reservations={reservations} reservationsError={reservationsError} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat loadDashboard={loadDashboard} />
      </Route>
      <Route path="/reservations">
        <Redirect to={"/dashboard"} reservations={reservations} reservationsError={reservationsError} />
      </Route>
      <Route path="/search">
        <ReservationSearch />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard 
          date={date} 
          reservations={reservations} 
          reservationsError={reservationsError}
          loadDashboard={loadDashboard}
          tables={tables}
          tablesError={tablesError} 
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;