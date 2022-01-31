import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation({
    setReservationErrors, 
    initialReservationErrorsState,
    refresh,
    setRefresh}) {

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
        status: "booked"
    }
    const {reservation_id} = useParams()
    const [formData, setFormData] = useState(initialFormState)
    const history = useHistory()

    function loadReservation() {
        const abortController = new AbortController()
        readReservation(reservation_id, abortController.signal)
            .then((data) => setFormData({...data, reservation_time: data.reservation_time.substring(0, data.reservation_time.length - 3)}))
        return () => abortController.abort()
    }

    useEffect(loadReservation,[reservation_id])

    function validTime(){
        const time = formData.reservation_time
        if(time < "10:30" || time > "21:30"){
            const timeError = new Error("Reservation cannot be made for when restaurant is closed")
            setReservationErrors([
                timeError
            ])
            return false
        }
        return true
    }

    function validDate(){
        const today = new Date()
        const dateFromForm = new Date(`${formData.reservation_date}T${formData.reservation_time}:00`)
            if(dateFromForm < today || dateFromForm.getDay() === 2){
                if(dateFromForm < today){
                     const furtureError = new Error("Reservation must be made in the future")
                    setReservationErrors([
                        furtureError
                    ])
                }
                if(dateFromForm.getDay() === 2){
                    const tuesdayError =  new Error("Reservation cannot be made on a Tuesday")
                    setReservationErrors([
                        tuesdayError
                    ])
                }
                return false
            }
            return true
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        setReservationErrors(initialReservationErrorsState)
        const peopleAsNumber = {
            ...formData,
            people: parseInt(formData.people)
        }
        const abortController = new AbortController()
        if(validDate() && validTime()){
            updateReservation( reservation_id, peopleAsNumber, abortController.signal)
            .then(() => setRefresh(!refresh))
            .then(history.push(`/dashboard?date=${formData.reservation_date}`))
        }
        return () => abortController.abort()
    }


    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const cancelHandler = (event) => {
        event.preventDefault()
        history.goBack()
    }

    return (
    <div>
        <div>
            <h3>Edit Reservation {reservation_id}</h3>
        </div>
        <div>
            <ReservationForm  
            reservation={formData} 
            handleChange={handleChange}
            cancelHandler={cancelHandler}
            handleSubmit={handleSubmit}/>
        </div>
    </div>)
}

export default EditReservation