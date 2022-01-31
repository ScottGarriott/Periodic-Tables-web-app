import React from "react";
import { updateReservationStatus } from "../utils/api";
import { today } from "../utils/date-time";
import "./Reservations.css"

function ReservationCard({reservation, refresh, setRefresh}) {

    function cancelReservationHandler(event){
        event.preventDefault()
        const abortController = new AbortController()
        if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
            updateReservationStatus(reservation.reservation_id, {status: "cancelled"}, abortController.signal)
                .then(() => setRefresh(!refresh))
        }
        return () => abortController.abort()
    }

     
  return (  
    <div className="card p-3 m-3">
        <div >
            <div className="card-title card-name">
                <h4>Reservation Name: {reservation.first_name} {reservation.last_name}</h4>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item reservation-list">
                    Reservation Phone Number: {reservation.mobile_number}
                </li>
                <li className="list-group-item reservation-list">
                    Reservation Time: {reservation.reservation_time}
                </li>
                <li className="list-group-item reservation-list">
                    Reservation Date: {reservation.reservation_date}
                </li>
                <li className="list-group-item reservation-list">
                    Number of People: {reservation.people}
                </li>
                <li className="list-group-item reservation-list" data-reservation-id-status={reservation.reservation_id} >
                    Reservation Status: {reservation.status}
                </li>
            </ul>
            {reservation.status === "booked" ? 
            (<div>
                <a 
                className="btn btn-primary m-3" 
                href={`/reservations/${reservation.reservation_id}/seat`}>
                Seat
                </a>

                {reservation.reservation_date >= today() ? <a
                className="m-3 btn btn-primary" 
                href={`/reservations/${reservation.reservation_id}/edit`}>
                Edit
                </a>: null}

                <button 
                className="btn btn-primary m-3" 
                data-reservation-id-cancel={reservation.reservation_id} 
                onClick={cancelReservationHandler}>
                Cancel Reservation
                </button>

            </div>) : null}    
        </div>
    </div>)
}

export default ReservationCard