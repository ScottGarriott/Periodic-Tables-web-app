# Periodic Tables
A web app designed to help restaurants track and seat reservations using Node.js, JS, React, HTML 5 and CSS 3.

# Deployed App
https://periodic-tables-7447-front-end.herokuapp.com

# Technology used
  ### Frontend
    - React.js
    - Bootstrap
    - CSS 3
    
  ### Backend
    - Node.js
    - Posgres
    - Express
     
# Summary

Periodic Tables is a restaurant reservation management app that allows the front of house staff at a restaurant add, edit, seat, search, and cancel reservations.  It also alows users to add tables to represent tables at their restaurant.

# Installation instructions

### Frontend
    cd into Thinkful-Final-Capstone/front-end
        - run npm install
        - run npm start to start the application

### Backend
    cd into Thinkful-Final-Capstone/back-end
        - run npm install
        - run npm start to start the application

# Features

## Creating a reservation
![This is an image of the new reservations page.](https://github.com/ScottGarriott/restaurant-reservations-app/blob/main/images/screenshot-new-reservation-page.png)

To create a new reservation click "New Reservation" on the navigation bar.  All reservations require a first name, last name, moblie number, reservation time, reservation date, and number of people.


## Cancel, Edit, seat reservations
![This is an image of the dashboard page.](https://github.com/ScottGarriott/restaurant-reservations-app/blob/main/images/screenshot-%20dashboard.png)

Canceling, editing, or seating a reservation can be done in the dashboard.

### Cancel
Click on the "cancel reservation" button on the reservation card.  You will receive a popup in which you can confirm that you want to cancel this reservation.

### Edit
Click on the "edit" button on the rservation card and you will be redirected to the edit reservations page.

![This is an image of the edit reservations page.](https://github.com/ScottGarriott/restaurant-reservations-app/blob/main/images/screenshot-edit-reservation-page.png)

### Seat
Click on the "seat" button on the reservation card and you will be redirected to the seat reservation page.  

![This is an image of the edit reservations page.](https://github.com/ScottGarriott/restaurant-reservations-app/blob/main/images/screenshot-seat-reservation-page.png)

## Searching for reservations

Users can search for reservations by mobile number associated with the reservation. Click "Search" on the navbar to be redirected to the search reservations page.

![This is an image of the edit reservations page.](https://github.com/ScottGarriott/restaurant-reservations-app/blob/main/images/screenshot-search-reservations-page.png)

## Creating tables

Users can add new tables to the database by clicking "New Table" on the navbar.

![This is an image of the edit reservations page.](https://github.com/ScottGarriott/restaurant-reservations-app/blob/main/images/screenshot-new-table-page.png)

# API

## Create reservation

_POST_ /reservations

Creates a new reservation.

-_Required body_:

  *first_name: string

  *last_name: string

  *party: int

  *reservation_date: date

  *reservation_time: str
  
  *mobile_number: str

## Get reservations by date / mobile number

_GET_ /reservations?date=<reservation_date>

Returns reservations for given date

_GET_ /reservations?mobile_number=<mobile_number>

Searches and returns reservations with given mobile_number

## Get / Post reservations by reservation_id

_GET_ /reservations/:reservation_id

Returns a reservation with the coresponding id.

_PUT_ /reservations/:reservation_id

Updates existing reservation.

-_Required body_:

  *first_name: string

  *last_name: string

  *party: int

  *reservation_date: date

  *reservation_time: str

  *mobile_number: str

## Update reservation status

_PUT_ /reservations/:reservation_id/status

Updates the status of a particular reservation.

-_Required body_:

  *status: str

## Get tables
 _GET_ /tables

 Returns all tables.

 ## Create table 

 _POST_ /tables

 Creates a new table.

 -_Required body_:

    *table_name: str

    *capacity: int

## Seat reservation at table

_PUT_ /tables/:table_id/seat

Ties reservation_id to particular table.

-_Required body_:

  *reservation_id: int

## Finish reservation at table

_DELETE_ /tables/:table_id/seat

Removes reservation_id from particular table.

-_Required body_:

  *reservation_id: int
