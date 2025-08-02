const express = require('express');
const cors = require("cors");
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
 
app.use(bodyParser.json());// nhận dư liêu form json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));


const apiRoute = require("./routes/api");
app.use('/api', apiRoute);



app.listen(port, () => {
    console.log('http://localhost:5000');
})