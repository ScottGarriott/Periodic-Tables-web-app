import React from "react";
import ReservationCard from "./ReservationCard";
import "./Reservations.css"

function ReservationList({
  reservations, 
  showAll,
  refresh,
  setRefresh}) {

  if(reservations.length > 0){
  return ( reservations.map((reservation) => {
    
        if(showAll) {
          return (
            <ReservationCard 
            reservation={reservation} 
            key={`${reservation.reservation_id}`} 
            refresh={refresh}
            setRefresh={setRefresh} />
          )
        }else{
        if(reservation.status !== "finished" && reservation.status !== "cancelled"){
          return (
          <ReservationCard 
          reservation={reservation} 
          key={`${reservation.reservation_id}`}  
          refresh={refresh}
          setRefresh={setRefresh}/>
          )
      }else{
        return null
      }
    }
      }))
    }else{
      return <h4 className="card-name">No reservations found</h4>
    }
}
export default ReservationList