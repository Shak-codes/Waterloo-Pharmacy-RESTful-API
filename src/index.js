// Import required modules
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
const fs = require("fs");
const apiData = require("../data");
const doctors = require("./routes/doctors");
const patients = require("./routes/patients");
const hospitals = require("./routes/hospitals");

// setup express and port
const app = express();
const PORT = process.env.PORT || 4000;

// Setup search for JSON data
app.use(express.json());

// Setup Swagger documentation
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Setup doctor endpoint
app.use("/api/v1/doctor", doctors);

// Setup patient endpoint
app.use("/api/v1/patient", patients);

// Setup hospital endpoint
app.use("/api/v1/hospital", hospitals);


// Root of API
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Waterloo Pharmacy RESTful API' });
    //res.send("Hello UW friends")
});


// List of visits by Doctor and/or Patient id Endpoint
app.get('/api/v1/visits', (req, res) => {
    let visits = apiData.data[0].visits;
    const {doctorid, patientid} = req.query;
    
    if (doctorid) {
        let idValue = parseInt(doctorid);
        if (Number.isNaN(idValue)) {
            res.status(406).json({"message": `Doctor ID '${doctorid}' is not a number`});
        }
        visits = visits.filter(visit => visit.doctorid === parseInt(doctorid));
    }

    if (patientid) {
        let idValue = parseInt(patientid);
        if (Number.isNaN(idValue)) {
            res.status(406).json({"message": `Patient ID '${patientid}' is not a number`});
        }
        visits = visits.filter((visit) => visit.patientid === parseInt(patientid));
    }

    res.json(visits).status(200);
});

// Get hospital by patient and / or doctor id
app.get('/api/v1/hospital', (req, res) => {
    const {doctorid, patientid} = req.query;
    let hospitals = apiData.data[0].hospitals;
    
    if (doctorid) {
        let idValue = parseInt(doctorid);
        if (Number.isNaN(idValue)) {
            res.status(406).json({"message": `Doctor ID '${doctorid}' is not a number`});
        }
        hospitals = hospitals.filter(val => {
            let passed = val.doctors.some(({id}) => id === idValue);
            return passed;
          })
    }

    if (patientid) {
        let idValue = parseInt(patientid);
        if (Number.isNaN(idValue)) {
            res.status(406).json({"message": `Patient ID '${patientid}' is not a number`});
        }
        hospitals = hospitals.filter(val => {
            let passed = val.patients.some(({id}) => id === idValue);
            return passed;
          })
    }

    res.json(hospitals).status(200);
});


// Confirm that PORT is listening for any requests
app.listen(PORT, () => {
    console.log(`I'm alive and listening on port: ${PORT}`);
});

