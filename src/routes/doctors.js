"use strict";
const express = require("express");
const fs = require("fs");
const apiData = require("../../data.json");
let router = express.Router();

// API Code for Doctors

// Router endpoint regarding all doctors
router

    // Route
    .route("/all")


    // Get all Doctors Endpoint
    .get((req, res) => {
        res.json(apiData.data[0].doctors).status(200);
    })


    // Delete All Doctors Endpoint
    .delete((req, res) => {
        let response = apiData.data[0].doctors;

        apiData.data[0].doctors = [];

        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(response).status(200);
    });


// Router endpoint regarding the addition of a doctor
router

    // Route
    .route("")

    // Add Doctor Endpoint
    .post((req, res) => {
        const doctor_data = apiData.data[0].doctors;

        const id = doctor_data.length + 1;
    
        const body = {
            id,
            ...req.body
        };
    
        apiData.data[0].doctors.push(body);
    
        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(body).status(200);
    });


// Router endpoint regarding an individual doctor
router

    // Route
    .route("/:id")

    // Get Specific Doctor by id Endpoint
    .get((req, res) => {
        let id = parseInt(req.params.id);
        let doctors = apiData.data[0].doctors;
        let response = doctors.find(doctor => doctor.id === id);
    
        if (!response) {
            res.status(404).json({"message": `Doctor with ID: ${id} doesn't exist`});
        }
        res.json(response).status(200);
    })


    // Delete Individual Doctor Endpoint
    .delete((req, res) => {
        let id = parseInt(req.params.id);
        let doctors = apiData.data[0].doctors;
        let response = doctors.find(doctor => doctor.id === id);
    
        if (!response) {
            res.status(404).json({"message": `Doctor with ID: ${id} doesn't exist`});
        }
    
        for (let i = 0; i < doctors.length; i++) {
            if (response == apiData.data[0].doctors[i]) {
                apiData.data[0].doctors.splice(i, 1);
            }
        }
    
        update_doctor_id();
    
        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(response).status(200);
    })

// UPDATE DOCTOR LIST ID AFTER DELETION OF AN INDIVIDUAL DOCTOR
function update_doctor_id() {

    const doctors = apiData.data[0].doctors

    for (let i = 0; i < doctors.length; i++) {
        apiData.data[0].doctors[i].id = i + 1;
    }

}

module.exports = router;