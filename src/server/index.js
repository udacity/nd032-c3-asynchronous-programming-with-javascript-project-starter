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
	try {
		const cars = require('../../data.json')
		const response = {
			id: Math.floor((Math.random() * 100) + 1),
			track: req.body.track_id,
			player_id: req.body.player_id,
			cars,
			results: ['IN_PROGRESS']
		}
		res.send({race: response});
	} catch (err) {
		res.send(400);
		console.log('error occured on POST /api/races', err)
	}
})

app.get('/api/races/:id', async (req, res) => {
	// Post races
	res.send(req)
})

app.post('/api/races/:id/start', async (req, res) => {
	// Post races
	res.send('Race is Started')
})

app.post('/api/races/{id}/accelerate', async (req, res) => {
	// Post races
	res.send(req)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
