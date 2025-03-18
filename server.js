const path = require('path')
const express = require('express')

const app = express()

// making the frontend "public" folder static for connecting with the backend
app.use(express.static());

const PORT = 3000 || process.env.PORT;

app.listen(PORT, ()=>{console.log(`server running on ${PORT} `);});