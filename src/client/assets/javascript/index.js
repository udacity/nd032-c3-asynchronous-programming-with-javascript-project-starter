/* eslint-disable no-undef */
// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE
const SERVER = 'http://localhost:3000'

// The store will hold all information needed globally
const store = {
	track_id: 0,
	player_id: 0,
	race_id: 0,
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
	onPageLoad()
	setupClickHandlers()
})

function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch (error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function (event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()

			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch (error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {

	const tracks = await getTracks();
	const track = tracks.find(x => x.id === +(store.track_id))

	// render starting UI
	renderAt('#race', renderRaceStartView(track))

	// TODO - Get player_id and track_id from the store
	const player_id = store.player_id;
	const track_id = store.track_id;

	// const race = TODO - invoke the API call to create the race, then save the result
	const race = await createRace(player_id, track_id);
	console.log(`race >>>>> `, race);

	// TODO - update the store with the race id
	store.race_id = race.id;

	// The race has been created, now start the countdown
	// TODO - call the async function runCountdown
	await runCountdown();

	// TODO - call the async function startRace
	await startRace(store.race_id);

	// TODO - call the async function runRace
	await runRace(store.race_id);
}

async function runRace(raceID) {
	try {
		return new Promise((resolve) => {
			// TODO - use Javascript's built in setInterval method to get race info every 500ms
			const raceInterval = setInterval(async () => {
				// TODO - if the race info status property is "in-progress", update the leaderboard by calling:
				const res = await getRace(raceID);
				console.log(`Get race >>>>> ${JSON.stringify(res)}`);
				if (res.status === 'IN_PROGRESS') {
					renderAt('#leaderBoard', raceProgress(res.positions))
				}
				// TODO - if the race info status property is "finished", run the following:
				if (res.status === 'FINISHED') {
					clearInterval(raceInterval) // to stop the interval from repeating
					renderAt('#race', resultsView(res.positions)) // to render the results view
					resolve(res) // resolve the promise
				}
			}, 500)
		})
		// remember to add error handling for the Promise
	} catch (error) {
		console.log(error);
	}
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// TODO - use Javascript's built in setInterval method to count down once per second
			const countDownInterval = setInterval(() => {
				// run this DOM manipulation to decrement the countdown for the user
				document.getElementById('big-numbers').innerHTML = --timer

				// TODO - if the countdown is done, clear the interval, resolve the promise, and return
				if (timer === 0) {
					clearInterval(countDownInterval)
					resolve(timer)
				}
			}, 1000)
		})
	} catch (error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected racer to the store
	store.player_id = +(target.id)
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected track id to the store
	store.track_id = +(target.id)
}

function handleAccelerate() {
	// TODO - Invoke the API call to accelerate
	accelerate(store.race_id);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>Top Speed: ${top_speed}</p>
			<p>Acceleration: ${acceleration}</p>
			<p>Handling: ${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>
			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------



// eslint-disable-next-line no-unused-vars
function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

async function getTracks() {
	let response;
	try {
		response = await axios.get(`${SERVER}/api/tracks`);
	} catch (error) {
		response = error.response;
	}
	return response.data;
}

async function getRacers() {
	let response;
	try {
		response = await axios.get(`${SERVER}/api/cars`);
	} catch (error) {
		response = error.response;
	}
	return response.data;
}

async function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	let response;
	try {
		response = await axios.post(`${SERVER}/api/races`, body);
	} catch (error) {
		response = error.response;
	}
	return response.data;
}

async function getRace(id) {
	let response;
	try {
		response = await axios.get(`${SERVER}/api/races/${id}`);
	} catch (error) {
		response = error.response;
	}
	return response.data;
}

async function startRace(id) {
	let response;
	try {
		response = await axios.post(`${SERVER}/api/races/${id}/start`);
	} catch (error) {
		response = error.response;
	}
	return response.data;
}

async function accelerate(id) {
	let response;
	try {
		response = await axios.post(`${SERVER}/api/races/${id}/accelerate`);
	} catch (error) {
		response = error.response;
	}
	return response.data;
}