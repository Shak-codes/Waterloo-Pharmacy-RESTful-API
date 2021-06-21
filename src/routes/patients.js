"use strict";
const express = require("express");
const fs = require("fs");
const apiData = require("../../data.json");
let router = express.Router();

// API Code for Patients


// Router endpoint regarding all patients
router
    .route("/all")

    // Get all Patients Endpoint
    .get((req, res) => {
        res.json(apiData.data[0].patients).status(200);
    })

    // Delete All Patients Endpoint
    .delete((req, res) => {
        let response = apiData.data[0].patients;

        apiData.data[0].patients = [];

        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(response).status(200);
    });


// Router endpoint regarding the addition of a patient
router
    .route("")

    // Add Patient Endpoint
    .post((req, res) => {
        const patient_data = apiData.data[0].patients;

        const id = patient_data.length + 1;

        const body = {
            id,
            ...req.body
        };
        apiData.data[0].patients.push(body);
    
        const data = JSON.stringify(apiData, null, 4);
    
        res.json(body).status(200);
    
        fs.writeFileSync("data.json", data, err => {
            
            // Checking for errors
            if (err) throw err; 
            
            console.log("Done writing"); // Success
        });
    });


// Router endpoint regarding an individual patient
router
    .route("/:id")

    // Get Specific Patient by id Endpoint
    .get((req, res) => {
        let id = parseInt(req.params.id);
        let patients = apiData.data[0].patients;
        let response = patients.find(patients => patients.id === id);
        
        if (!response) {
            res.status(404).json({"message": `Patient with ID: ${id} doesn't exist`});
        }
        res.json(response).status(200);
    })

    // Delete Individual Patient Endpoint
    .delete((req, res) => {
        let id = parseInt(req.params.id);
        let patients = apiData.data[0].patients;
        let response = patients.find(patient => patient.id === id);
    
        if (!response) {
            res.status(404).json({"message": `Patient with ID: ${id} doesn't exist`});
        }
    
        for (let i = 0; i < patients.length; i++) {
            if (response == apiData.data[0].patients[i]) {
                apiData.data[0].patients.splice(i, 1);
            }
        }
    
        update_patient_id();
    
        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(response).status(200);
    });


// UPDATE PATIENT LIST ID AFTER DELETION OF AN INDIVIDUAL PATIENT
function update_patient_id() {
    
    const patients = apiData.data[0].patients

    for (let i = 0; i < patients.length; i++) {
        apiData.data[0].patients[i].id = i + 1;
    }

}

module.exports = router;