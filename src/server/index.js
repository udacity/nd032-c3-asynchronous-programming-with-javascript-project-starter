const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = 3000

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// setup the express assets path
app.use('/', express.static(path.join(__dirname, '../client')))

// API calls ------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../client/pages/home.html'));
})

app.get('/race', async (req, res) => {
	res.sendFile(path.join(__dirname, '../client/pages/race.html'));
})

app.get('/api/tracks', async (req, res) => {
	const response = require('../../data.json');
	res.send(response.tracks)
})

app.get('/api/cars', async (req, res) => {
	const response = require('../../data.json');
	res.send(response.cars)
})

app.post('/api/races', async (req, res) => {
	// 	[POST] api/races Create a race
	// id: number
	// track: string
	// player_id: number
	// cars: Cars[] (array of cars in the race)
	// results: Cars[] (array of cars in the position they finished, available if the race is finished)

})

app.post('/api/races/{id}', async (req, res) => {
	// Post races
})

app.post('/api/races/{id}/start', async (req, res) => {
	// Post races
})

app.post('/api/races/{id}/accelerate', async (req, res) => {
	// Post races
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
