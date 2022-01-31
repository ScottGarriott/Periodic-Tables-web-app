import React, { useState } from "react";
import { Route, Switch } from "react-router";
import NewResevation from "./NewReservation";
import ErrorAlert from "../layout/ErrorAlert";
import SeatReservation from "../seat/SeatReservation";
import EditReservation from "./EditReservation";

function Resevations({
    refresh,
    setRefresh }) {
    
    const initialReservationErrorsState = []
    const [reservationErrors, setReservationErrors] = useState(initialReservationErrorsState)

    return (
        <div>
            <div>
                {reservationErrors.map((error, index) => {
                    return (
                            <div key={index}>
                                <ErrorAlert error={error} />
                            </div>
                        )
                })}
            </div>
            <h1>Reservations</h1>
            <Switch>
                <Route exact={true} path="/reservations/new">
                    <NewResevation 
                    setReservationErrors={setReservationErrors} 
                    initialReservationErrorsState={initialReservationErrorsState}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    />
                </Route>
                <Route exact={true} path="/reservations/:reservation_id/seat">
                    <SeatReservation 
                    setReservationErrors={setReservationErrors}
                    initialReservationErrorsState={initialReservationErrorsState}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    />
                </Route>
                <Route exact={true} path="/reservations/:reservation_id/edit">
                    <EditReservation
                    setReservationErrors={setReservationErrors} 
                    initialReservationErrorsState={initialReservationErrorsState}
                    refresh={refresh}
                    setRefresh={setRefresh} />
                </Route>
            </Switch>
        </div>
    )
};

export default Resevations;