/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = 3000

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let race = {
	id: undefined,
	track: undefined,
	player_id: undefined,
	results: [],
	positions: [],
	status: 'UNSTARTED'
}

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

// create a race
app.post('/api/races', async (req, res) => {
	try {
		const data = require('../../data.json');
		race.id = Math.floor((Math.random() * 100) + 1);
		race.track = data.tracks.find(x => x.id === req.body.track_id);
		race.player_id = req.body.player_id;
		data.cars.forEach(car => {
			race.positions.push(car)
		});
		race.positions.forEach((position) => {
			position.segment = 1;
		})
		res.send(race);
	} catch (err) {
		res.sendStatus(400);
		console.log('error occured on POST /api/races', err)
	}
})

app.get('/api/races/:id', async (req, res) => {
	try {
		if (race.id === +(req.params.id)) {
			race.positions.forEach((position) => {
				if (position.id !== race.player_id) {
					position.segment += 1;
				}
				const completetion = position.segment / race.track.segments.length;
				const completionPercentage = Math.round(completetion * 100);
				console.log(`completionPercentage >>>>> `, completionPercentage);
				if (completionPercentage === 100) {
					race.status = 'FINISHED'
				}
			});
			res.send(race);
		} else {
			res.sendStatus(404);
		}
	} catch (err) {
		res.sendStatus(400);
		console.log('error occured on POST /api/races', err)
	}
})

// start race
app.post('/api/races/:id/start', async (req, res) => {
	if (race.id === +(req.params.id)) {
		race.status = 'IN_PROGRESS'
		res.sendStatus(200)
	} else {
		res.sendStatus(404);
	}
})

// accelerate 
app.post('/api/races/:id/accelerate', async (req, res) => {
	if (race.id === +(req.params.id)) {
		// get track
		const player = race.positions.find(p => p.id === race.player_id);
		player.segment += 1;
		res.sendStatus(200)
	} else {
		res.sendStatus(404);
	}
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
