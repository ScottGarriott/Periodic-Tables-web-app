import React from "react";

function ReservationForm({handleSubmit, cancelHandler, handleChange, reservation}) {
    
    return (
        <div>
        <form onSubmit = {handleSubmit}>
            <div className="form-group">

                <label htmlFor="firstName">First Name</label>
                <input 
                type="text"
                name="first_name"
                placeholder="First Name"
                className="form-control"
                required
                id="firstName"
                onChange={handleChange}
                value={reservation.first_name}
                ></input>

                <label htmlFor="lastName">Last Name</label>
                <input 
                type="text"
                name="last_name"
                placeholder="Last Name"
                className="form-control"
                required
                id="lastName"
                onChange={handleChange}
                value={reservation.last_name}
                ></input>

                <label htmlFor="mobileNumber">Mobile Number</label>
                <input 
                type="tel"
                name="mobile_number"
                placeholder="xxx-xxxx"
                className="form-control"
                required
                id="mobileNumber"
                onChange={handleChange}
                value={reservation.mobile_number}
                ></input>

                <label htmlFor="reservation_date">Date of Reservation</label>
                <input 
                type="date"
                name="reservation_date"
                className="form-control"
                required
                id="reservationDate"
                onChange={handleChange}
                value={reservation.reservation_date}
                ></input>

                <label htmlFor="reservation_time">Time of Reservation</label>
                <input 
                type="time"
                name="reservation_time"
                className="form-control"
                required
                id="reservationtime"
                onChange={handleChange}
                value={reservation.reservation_time}
                ></input>

                <label htmlFor="people">Number of People</label>
                <input 
                type="number"
                name="people"
                className="form-control"
                required
                id="people"
                min={1}
                onChange={handleChange}
                value={reservation.people}
                ></input>
            </div>
            <div>
                <button type="submit" className="m-3 btn btn-primary" onClick={handleSubmit}>Submit</button>
                <button type="cancel" className="m-3 btn btn-danger" onClick={cancelHandler}>Cancel</button>
            </div>
        </form>
    </div>
    )
};

export default ReservationForm;