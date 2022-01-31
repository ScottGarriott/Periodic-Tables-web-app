import React, {useState} from "react";
import ReservationForm from "./ReservationForm";
import {useHistory} from "react-router-dom"
import { createReservations } from "../utils/api";


function NewResevation( 
    {setReservationErrors, 
    initialReservationErrorsState,
    refresh,
    setRefresh} ) {

    const history = useHistory()

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
        status: "booked"
    }

    const [formData, setFormData] = useState(initialFormState)

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

    
    function cancelHandler(event){
        event.preventDefault()
        history.goBack()
    }

    function handleSubmit(event){
        event.preventDefault()
        setReservationErrors((prevState) => prevState = initialReservationErrorsState)
        const peopleAsNumber = {
            ...formData,
            people: parseInt(formData.people)
        }
        const abortController = new AbortController()
        if(validDate() && validTime()){
            createReservations(peopleAsNumber, abortController.signal)
            .then(() => setRefresh(!refresh))
            .then(history.push(`/dashboard?date=${formData.reservation_date}`))
            setFormData(initialFormState)
        }
        return () => abortController.abort()
    }


    function handleChange({target}){
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    return (
        <div>
            <h3>New Reservation</h3>
            <ReservationForm 
            handleSubmit = {handleSubmit} 
            handleChange={handleChange}
            cancelHandler={cancelHandler}
            reservation={formData}
            />
        </div>
    )
}

export default NewResevation