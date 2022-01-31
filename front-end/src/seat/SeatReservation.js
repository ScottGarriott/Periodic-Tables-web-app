import React, {useState, useEffect} from "react";

import {useParams, useHistory} from "react-router"
import { listTables, readReservation, seatReservation } from "../utils/api";
function SeatReservation({
    setReservationErrors,
    initialReservationErrorsState,
    refresh,
    setRefresh}) {

    const history = useHistory()
    const { reservation_id } = useParams()

    const [reservation, setReservation] = useState({})
    const [tables, setTables] = useState([])
    const [selection, setSelection] = useState({})

    useEffect(loadTables, [])
    useEffect(loadReservation, [reservation_id])

    //validation functions
    function isPartySizeUnderCapacity() {
        setReservationErrors(initialReservationErrorsState)
       if(selection.capacity >= reservation.people){
           return true
       }else{
           const capacityError = new Error("Reservation party size cannot be more than table capacity.")
           setReservationErrors([capacityError])
           return false
       }
    }

    function selectionIsTable() {
        setReservationErrors(initialReservationErrorsState)
       if(selection.capacity){
           return true
       }else{
           const noReservationError = new Error("Please choose a table to seat your reservation.")
           setReservationErrors([noReservationError])
           return false
       }
    }

    //loading functions
    function loadReservation() {
        
        const abortController = new AbortController()

        readReservation(reservation_id, abortController.signal)
            .then(setReservation)

        return () => abortController.abort()
    }

    function loadTables() {
        const abortController = new AbortController()
        listTables(abortController.signal)
          .then(setTables)
    
        return () => abortController.abort()
      }
    
    const submitHandler = (event) => {
        event.preventDefault()
        const abortController = new AbortController()
        if(selectionIsTable() && isPartySizeUnderCapacity()){
            seatReservation(selection.table_id, parseInt(reservation_id), abortController.signal)
            .then(() => setRefresh(!refresh))
            .then(() => history.push("/dashboard"))
        }
        return () => abortController.abort()
    }

    const changeHandler = ({target}) => {
        const table = tables.find((table) => table.table_id === parseInt(target.value))
        setSelection({
            table_id: parseInt(table.table_id),
            capacity: parseInt(table.capacity)
        })
    }

    const cancelHandler = (event) => {
        event.preventDefault()
        history.goBack()
    }

   return (
    <div>
        <div>
            <h1>
            Seat Reservation {`${reservation.reservation_id}`}
            </h1>
            <legend>Choose a table to seat reservation</legend>
            <form>
                <div className="form-group">
                    <select 
                    className="form-select form-select-lg mb-3" 
                    required 
                    onChange={changeHandler}
                    name="table_id">
                         <option value={null} 
                                key={"choose"}>
                                    Choose a table to seat your reservation
                                </option>
                        {tables.map((table) => {
                            if(!table.reservation_id){
                            return (
                                <option 
                                value={table.table_id} 
                                key={table.table_id}>
                                    {`${table.table_name} - ${table.capacity}`}
                                </option>
                            )
                        }else{
                            return null
                        }
                        })}
                    </select>
                    <div>
                        <button className="btn btn-primary" type="submit" onClick={submitHandler}>Seat</button>
                        <button type="cancel" className="btn btn-danger" onClick={cancelHandler}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    )
}
export default SeatReservation