// Import required modules
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
const fs = require("fs");
const apiData = require("../data");

// setup express and port
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.json({ message: 'Hello friends to my first RESTful API' });
    //res.send("Hello UW friends")
});

/*
* Create end points or Routes to get doctor & visits information
* We will be leveraging the data file
*/
// api/v1/doctors

// API Code for Doctors

// Get all Doctors Endpoint
app.get('/api/v1/doctors', (req, res) => {
    res.json(apiData.data[0].doctors).status(200);
});

// Get Specific Doctor by id Endpoint
app.get('/api/v1/doctor/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let doctors = apiData.data[0].doctors;
    let response = doctors.find(doctor => doctor.id === id);

    if (!response) {
        res.status(404).json({"message": `Doctor with ID: ${id} doesn't exist`});
    }
    res.json(response).status(200);
});

// Add Doctor Endpoint
app.post('/api/v1/doctors', (req, res) => {
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

    res.json(apiData.data[0].doctors).status(200);

});


// Delete All Doctors Endpoint
app.delete('/api/v1/doctors', (req, res) => {
    apiData.data[0].doctors = [];

    const data = JSON.stringify(apiData, null, 4);

    fs.writeFileSync("data.json", data, err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });

    res.json(apiData.data[0].doctors).status(200);
});

// Delete Individual Doctor Endpoint
app.delete('/api/v1/doctor/:id', (req, res) => {
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

    res.json(apiData.data[0].doctors).status(200);
});


// API Code for Patients


// Get all Patients Endpoint
app.get('/api/v1/patients', (req, res) => {
    res.json(apiData.data[0].patients).status(200);
});

// Get Specific Patient by id Endpoint
app.get('/api/v1/patients/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let patients = apiData.data[0].patients;
    let response = patients.find(patients => patients.id === id);
    
    if (!response) {
        res.status(404).json({"message": `Patient with ID: ${id} doesn't exist`});
    }
    res.json(response).status(200);
});

// Add Patient Endpoint
app.post('/api/v1/patients', (req, res) => {
    const patient_data = apiData.data[0].patients;

    const id = patient_data.length + 1;
    const body = {
        id,
        ...req.body
    };
    apiData.data[0].patients.push(body);

    const data = JSON.stringify(apiData, null, 4);

    res.json(apiData.data[0].patients).status(200);

    fs.writeFileSync("data.json", data, err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });
});

// Delete All Patients Endpoint
app.delete('/api/v1/patients', (req, res) => {
    apiData.data[0].patients = [];

    const data = JSON.stringify(apiData, null, 4);

    fs.writeFileSync("data.json", data, err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });

    res.json(apiData.data[0].patients).status(200);
});

// Delete Individual Patient Endpoint
app.delete('/api/v1/patient/:id', (req, res) => {
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

    res.json(apiData.data[0].patients).status(200);
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

// Get all hospitals
app.get('/api/v1/hospitals', (req, res) => {
    res.json(apiData.data[0].hospitals).status(200);
});

// Get hospital by specific id
app.get('/api/v1/hospital/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let hospitals = apiData.data[0].hospitals;
    let response = hospitals.find(hospitals => hospitals.id === id);
    
    if (!response) {
        res.status(404).json({"message": `Hospital with ID: ${id} doesn't exist`});
    }

    res.json(response).status(200);
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

// Add Hospital Endpoint
app.post('/api/v1/hospitals', (req, res) => {
    const hospital_data = apiData.data[0].hospitals;

    const id = hospital_data.length + 1;
    const body = {
        id,
        ...req.body
    };
    apiData.data[0].hospitals.push(body);

    const data = JSON.stringify(apiData, null, 4);

    res.json(apiData.data[0].hospitals).status(200);

    fs.writeFileSync("data.json", data, err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });
});

// Delete all hospitals
app.delete('/api/v1/hospitals', (req, res) => {
    apiData.data[0].hospitals = [];

    const data = JSON.stringify(apiData, null, 4);

    fs.writeFileSync("data.json", data, err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });

    res.json(apiData.data[0].hospitals).status(200);
});

// Delete hospital by specific id
app.delete('/api/v1/hospital/:id', (req, res) => {
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

    res.json(apiData.data[0].hospitals).status(200);
});

// Confirm that PORT is listening for any requests
app.listen(PORT, () => {
    console.log(`I'm alive and listening on port: ${PORT}`);
});

// CODE TO BE CALLED BY ANY ENDPOINTS

// UPDATE DOCTOR LIST ID AFTER DELETION OF AN INDIVIDUAL DOCTOR
function update_doctor_id() {

    const doctors = apiData.data[0].doctors

    for (let i = 0; i < doctors.length; i++) {
        apiData.data[0].doctors[i].id = i + 1;
    }

}

// UPDATE PATIENT LIST ID AFTER DELETION OF AN INDIVIDUAL PATIENT
function update_patient_id() {
    
    const patients = apiData.data[0].patients

    for (let i = 0; i < patients.length; i++) {
        apiData.data[0].patients[i].id = i + 1;
    }

}

// UPDATE HOSPITAL LIST ID AFTER DELETION OF AN INDIVIDUAL HOSPITAL
function update_hospital_id() {
    
    const hospitals = apiData.data[0].hospitals

    for (let i = 0; i < hospitals.length; i++) {
        apiData.data[0].hospitals[i].id = i + 1;
    }

}