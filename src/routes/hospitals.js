"use strict";
const express = require("express");
const fs = require("fs");
const apiData = require("../../data.json");
let router = express.Router();

// API Code for Hospitals


// Router endpoint regarding all hospitals
router
    .route("/all")

    // Get all hospitals
    .get((req, res) => {
        res.json(apiData.data[0].hospitals).status(200);
    })

    // Delete all Hospitals
    .delete((req, res) => {
        let response = apiData.data[0].hospitals;

        apiData.data[0].hospitals = [];

        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(response).status(200);
    });


// Router endpoint regarding the addition of a hospital
router
    .route("")

    // Add Hospital Endpoint
    .post((req, res) => {
        const hospital_data = apiData.data[0].hospitals;

        const id = hospital_data.length + 1;

        const body = {
            id,
            ...req.body
        };

        apiData.data[0].hospitals.push(body);
    
        const data = JSON.stringify(apiData, null, 4);

    
        fs.writeFileSync("data.json", data, err => {
            
            // Checking for errors
            if (err) throw err; 
            
            console.log("Done writing"); // Success
        });

        res.json(body).status(200);
    });


// Router endpoint regarding an individual hospital
router
    .route("/:id")

    // Get hospital by specific id
    .get((req, res) => {
        let id = parseInt(req.params.id);
        let hospitals = apiData.data[0].hospitals;
        let response = hospitals.find(hospitals => hospitals.id === id);
        
        if (!response) {
            res.status(404).json({"message": `Hospital with ID: ${id} doesn't exist`});
        }
    
        res.json(response).status(200);
    })

    // Delete hospital by specific id
    .delete((req, res) => {
        let id = parseInt(req.params.id);
        let hospitals = apiData.data[0].hospitals;
        let response = hospitals.find(hospital => hospital.id === id);
    
        if (!response) {
            res.status(404).json({"message": `Patient with ID: ${id} doesn't exist`});
        }
    
        for (let i = 0; i < hospitals.length; i++) {
            if (response == apiData.data[0].hospitals[i]) {
                apiData.data[0].hospitals.splice(i, 1);
            }
        }
    
        update_hospital_id();
    
        const data = JSON.stringify(apiData, null, 4);
    
        fs.writeFileSync("data.json", data, err => {
         
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
    
        res.json(response).status(200);
    });


// UPDATE HOSPITAL LIST ID AFTER DELETION OF AN INDIVIDUAL HOSPITAL
function update_hospital_id() {
    
    const hospitals = apiData.data[0].hospitals

    for (let i = 0; i < hospitals.length; i++) {
        apiData.data[0].hospitals[i].id = i + 1;
    }

}

module.exports = router;