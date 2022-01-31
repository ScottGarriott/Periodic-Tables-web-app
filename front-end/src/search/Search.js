import React, {useState} from "react";
import { useHistory } from "react-router";
import { searchReservations } from "../utils/api";
import ReservationList from "../reservations/ReservationList"
function Search({refresh, setRefresh}) {
    const initialReservationsState = []
    const history = useHistory()
    const [reservations, setReservations] = useState(initialReservationsState)
    const [searchNumber, setSearchNumber] = useState()
    const [searched, setSearched] = useState(false)

    function submitHandler(event) {
        event.preventDefault()
        setSearched(true)
        const abortController = new AbortController();
        if(searchNumber){
            searchReservations(searchNumber, abortController.signal)
                .then(setReservations)
        }
        return () => abortController.abort()
    }

    function changeHandler({target}) {
        setSearchNumber(target.value)
    }

    function cancelHandler(event) {
        event.preventDefault()
        setRefresh(!refresh)
        history.push("/dashboard")
    }

    return (
        <div>
           <h1>Search Reservations by Phone number</h1>
            <form onSubmit={submitHandler} className="m-3">
                <div className="row">
                    <input 
                    name="mobile_number" 
                    onChange={changeHandler}
                    placeholder="Enter a customer's phone number"
                    required
                    className="form-control"
                    />
                </div>
                <div className="row">
                    <button className="btn btn-primary m-3" type="submit">Find</button>
                    <button className="btn btn-danger m-3" onClick={cancelHandler}>Cancel</button>
                </div>
            </form>
            <div>
               
                <ReservationList reservations={reservations} showAll={true}/> 
                {searched === true && reservations.length === 0 ? 
                <h4>No reservations found</h4> :
                null }
            </div>
        </div>
    )
};

export default Search;