// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
	racers: undefined,
	race: undefined
};

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad();
	setupClickHandlers();
});

// JW This function executes once the page has finished loading.
// JW it calls getTracks and getRacers and then renders tracks and racers on the page.
async function onPageLoad() { // DONE!
	try {
		getTracks()
			.then(tracks => { // JW tracks is an array of objects containing track information
				const html = renderTrackCards(tracks); // JW html variable is the HTML code returned from renderTrackCards function				
				renderAt('#tracks', html); // JW insert 'html' into element with an ID of #tracks
			});

		getRacers()
			.then((racers) => { //JW racers is an array of objects containing racer information
				const html = renderRacerCars(racers); // JW html variable is the HTML code returned from renderRacerCars function
				store.racers = racers;
				renderAt('#racers', html); // JW insert 'html' into element with an ID of #racers
			});
	} catch(error) { // JW Error handling
		console.log("Problem getting tracks and racers ::", error.message);
		console.error(error);
	}
}

// JW this function handles elements on the page that are clicked.
// JW this is done instead of adding listeners to each specific element.
function setupClickHandlers() { // DONE!
	document.addEventListener('click', function(event) { // JW listen to every element on the page
		const { target } = event; // JW variable 'target' is the html element clicked
		
		// Race track form field
		// JW if the target has classes .card and .track, handle this way...
		if (target.matches('.card.track') || target.matches('.card.track > h3')) { 
			if (target.tagName === 'H3') {
				handleSelectTrack(target.parentElement);
			} else {
				handleSelectTrack(target);
			}
		}
		// Podracer form field
		// JW if the target has classes .card and .podracer, handle this way...
		if (target.matches('.card.podracer') || target.matches('.card.podracer > h3, p')) { 					
			if (target.tagName === 'H3' || target.tagName === 'P') {
				handleSelectPodRacer(target.parentElement);			
			} else {
				handleSelectPodRacer(target);
			}
		}
		// Submit create race form
		if (target.matches('#submit-create-race')) { // JW if the target has ID #submit-create-race, handle this way...
			event.preventDefault(); // JW prevent refreshing the page on form submission
			// start race
			handleCreateRace();
		}
		// Handle acceleration click
		if (target.matches('#gas-peddle')) { // JW if the target has ID #gas-peddle, handle this way...
			handleAccelerate(target);
		}
	}, false);
}

// JW this function will cause a delay in code for xx miliseconds?
async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here");
		console.log(error);
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	// render starting UI DONE
	renderAt('#race', renderRaceStartView(store.track_id, racers)); 
	
	// TODO - Get player_id and track_id from the store DONE
	const { player_id, track_id } = store;

	// const race = TODO - invoke the API call to create the race, then save the result DONE
	try {
		const countdownTimer = Number(document.getElementById('big-numbers').innerText);
		const theRace = await createRace(store.player_id, store.track_id);
		store.race_id = theRace.ID;
		store.race = theRace;
		// TODO - call the async function runCountdown DONE
		runCountdown();
		return theRace;
	} catch(error) {
		console.log(`Error! Error! ${error}`);
	}
	

	// TODO - call the async function startRace -RESUME FROM HERE
	
	// TODO - call the async function runRace
}

function runRace(raceID) {
	return new Promise(resolve => {
	// TODO - use Javascript's built in setInterval method to get race info every 500ms

	/* 
		TODO - if the race info status property is "in-progress", update the leaderboard by calling:

		renderAt('#leaderBoard', raceProgress(res.positions))
	*/

	/* 
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		resolve(res) // resolve the promise
	*/
	});
	// remember to add error handling for the Promise
}

async function runCountdown() {
	console.log('runcountdown was called');
	
	try {
		let bigNumbers = document.getElementById('big-numbers');
		// wait for the DOM to load
		// await delay(1000);
		let timer = 3;

		return new Promise(resolve => {
			// TODO - use Javascript's built in setInterval method to count down once per second
			const tock = () => {
				if (timer != 1) {
					bigNumbers.innerHTML = --timer;
				} else {
					clearInterval(tick);
					bigNumbers.innerHTML = 'GO!';
				}
			};
			// run this DOM manipulation to decrement the countdown for the user
			const tick = setInterval(tock, 1000); 
			// TODO - if the countdown is done, clear the interval, resolve the promise, and return
		});
	} catch(error) {
		console.log(error);
	}
}

// JW This function makes the selected racer appear selected, and adds the racer to the store.
function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// JW remove class 'selected' from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// JW add class 'selected' to current target
	target.classList.add('selected');

	// TODO - save the selected racer to the store 
	store.player_id = target.id;
}

// JW this function makes the selected track appear selected, and adds track ID to the store.
function handleSelectTrack(target) {
	console.log("selected track", target.id);

	// JW remove class 'selected' from all track options
	const selected = document.querySelector('#tracks .selected');
	if(selected) {
		selected.classList.remove('selected');
	}

	// JW add class 'selected' to current target
	target.classList.add('selected');

	// TODO - save the selected track id to the store
	store.track_id = target.id;
}

function handleAccelerate() {
	console.log("accelerate button clicked");
	// TODO - Invoke the API call to accelerate
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

// JW this function creates and returns the HTML code for the racer cards.
function renderRacerCars(racers) {
	if (!racers.length) { // JW if there are no racers to display, return an HTML placeholder 
		return `
			<h4>Loading Racers...</4>
		`;
	}
	
	// JW the 'results' variable is a mapped array of racer cards (HTML) that are then joined together as one string.
	const results = racers.map(renderRacerCard).join(''); 
	
	// JW The track cards are then returned inside a parent element (ul)
	return `
		<ul id="racers">
			${results}
		</ul>
	`;
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`;
}

// JW this function creates and returns the HTML code for the track cards.
function renderTrackCards(tracks) {
	// JW tracks is an array of objects containing track information
	if (!tracks.length) { // JW if there are no tracks to display, return an HTML placeholder
		return `
			<h4>Loading Tracks...</4>
		`;
	}
	
	// JW the 'results' variable is a mapped array of track cards (HTML) that are then joined together as one string.
	const results = tracks.map(renderTrackCard).join('');
	
	// JW The track cards are then returned inside a parent element (ul)
	return `
		<ul id="tracks">
			${results}
		</ul>
	`;
}

function renderTrackCard(track) {
	const { id, name } = track; // create variables id and name from individual track object passed in as argument
	
	// return an HTML block for the track card, using the ID and name variables
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
	`;
}

function renderRaceStartView(track, racers) {
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
	`;
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1);

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`;
}

function raceProgress(positions) {
	// userPlayer is the racer in positions var with the same id as the player_id in the store.
	let userPlayer = positions.find(e => e.id === store.player_id);
	// add "(you)" next to the userPlayer's name when rendering their progress card.
	userPlayer.driver_name += " (you)";

	// sort the positions
	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1);
	let count = 1;

	// create a block of HTML code (string) of table rows showing racer positions, stored in "results" variable.
	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
	});

	// stick the block of HTML code in the middle of the leaderboard and return it.
	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`;
}

// JW this function inserts generated HTML code into an element
function renderAt(element, html) { // JW arg element is the ID to target, html is the code to insert
	const node = document.querySelector(element);
	node.innerHTML = html;
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000';

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	};
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

// DONE
function getTracks() {
	console.log('getTracks was called.');
	try {
		const trackData = fetch(`${SERVER}/api/tracks`)
		.then(res => res.json());
		return trackData;
	} catch(error) {
		console.log(`getTracks Error: ${error}`);
	}

}

// DONE
function getRacers() {
	console.log('getRacers was called.');
	try {
		const racerData = fetch(`${SERVER}/api/cars`)
			.then(res => res.json())
		return racerData;
	} catch (error) {
		console.log(`getRacers Error: ${error}`);
	}
}

// ?? Where does this ever get called?
function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err));
}

// Where does this get called?
function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
	try {
		const race = fetch(`${SERVER}/api/races/${id}`)
		.then(res => res.json())
		.then(data => console.log(data));
	} catch(error) {
		console.log(error);
	}
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with getRace request::", err))
}

function accelerate(id) {
	fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => res.json())
	.catch(err => console.log('The gas pedal is broken ', err));
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
}
