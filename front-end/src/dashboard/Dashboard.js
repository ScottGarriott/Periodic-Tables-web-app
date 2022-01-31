import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import { previous, next } from "../utils/date-time";
import { useHistory } from "react-router";
import "./Dashboard.css"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, refresh, setRefresh }) {
  const history = useHistory()
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null)

   useEffect(loadReservations, [date, refresh])
   useEffect(loadTables, [refresh])

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

   function loadTables() {
      const abortController = new AbortController()
      setReservationsError(null)
      listTables(abortController.signal)
        .then(setTables)
        .catch((error) => setReservationsError(error))

      return () => abortController.abort()
    }

  function previousHandler(event) {
    event.preventDefault()
    const previousDate = previous(date)
    history.push(`/dashboard?date=${previousDate}`)
  }

  function nextHandler(event) {
    event.preventDefault()
    const nextDate = next(date)
    history.push(`/dashboard?date=${nextDate}`)
  }

  function todayHandler(event) {
    event.preventDefault()
    history.push("/dashboard")
  }

  return (
    <main className="container-fluid dashboard">
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3 row">
        
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="m-3"> 
        <button className="btn btn-primary mr-3" onClick={previousHandler}>Previous day</button>
        <button className="btn btn-primary mr-3" onClick={todayHandler}>Today</button>
        <button className="btn btn-primary" onClick={nextHandler}>Next day</button>
      </div>
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <div className="ml-3">
            <h4 className="mx-auto list-name">Reservations for {date}</h4>
          </div>
          <div>
            <ReservationList 
            reservations={reservations} 
            showAll={false}
            refresh={refresh}
            setRefresh={setRefresh}/>
          </div>
        </div>
      <div className="col-md-4 col-sm-12">
        <div className="ml-3">
          <h4 className="mx-auto list-name">Tables</h4>
        </div>
        <div>
          <TableList
          setReservationsError={setReservationsError} 
          setRefresh={setRefresh} 
          refresh={refresh}
          tables={tables}
          setTables={setTables}
           />
        </div>
      </div>
      </div>
    </main>
  );
}

export default Dashboard;
