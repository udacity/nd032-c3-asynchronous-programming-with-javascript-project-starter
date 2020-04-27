const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// setup the express assets path
app.use('/', express.static(path.join(__dirname, '../client')))

// API calls ------------------------------------------------------------------------------------

// EXAMPLE API CALL
// app.get('/your-page', async (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/pages/this-page.html'));
// })

// Your API Calls here --------

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
