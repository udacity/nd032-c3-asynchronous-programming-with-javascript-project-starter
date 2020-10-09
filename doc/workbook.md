# Workbook

## General 

- [ ] [Udaciracer video instructions](https://www.youtube.com/watch?v=b8rGy9Fm5tg&feature=emb_logo)
- [ ] [Rubric](https://review.udacity.com/#!/rubrics/2829/view)
- [ ] Original [Project Repo](https://github.com/udacity/nd032-c3-asynchronous-programming-with-javascript-project-starter)
- [ ] Submission: Once you've met all of the rubric requirements, you can either include a zip file or link to your GitHub repository. 

__NOTE:__ This starter code base has directions for you in src/client/assets/javascript/index.js. 
There you will be directed to use certain asynchronous methods to achieve tasks. You will know you're making progress as 
you can play through more and more of the game.

## Setup

#### Start the Server (API)
The game engine has been compiled down to a binary so that you can run it on any system. Because of this, you cannot 
edit the API in any way, it is just a black box that we interact with via the API endpoints.

To run the server, locate your operating system and run the associated command in your terminal at the root of the project.

Linux (Ubuntu, etc..)	ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux

#### Start the Frontend
First, run your preference of npm install && npm start or yarn && yarn start at the root of this project. Then you should 
be able to access http://localhost:3000.


## API Calls

To complete the race logic, find all the TODO tags in index.js and read the instructions.

| HTTP Verb | API Call | Parameters |
|-----------|----------|------------|
| [GET] | api/tracks List of all tracks | id: number (1), name: string ("Executioner"), segments: number[] ([87,47,29,31,78,25,80,76,60,14....]) |
| [GET] | api/cars List of all cars | id: number (3), driver_name: string ("Anakin Skywalker") top_speed: number (500) acceleration: number (10) handling: number (10) |
| [GET] | api/races/${id} Information about a single race | status: RaceStatus ("unstarted" | "in-progress" | "finished") positions object[] ([{ car: object, final_position: number (omitted if empty), speed: number, segment: number}])  |
| [POST] | api/races Create a race | id: number track: string player_id: number cars: Cars[] (array of cars in the race) results: Cars[] (array of cars in the position they finished, available if the race is finished) |
| [POST] | api/races/${id}/start Begin a race | Returns nothing |
| [POST]  | api/races/${id}/accelerate Accelerate a car | Returns nothing |


To get the API working do the following (assumes Linux):

* Run the server in a terminal
  ```
  ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux
  ```
* Test access using Curl or Postman
* Open a new terminal
* Test GET tracks i.e. api/tracks
  ```
  curl http://localhost:8000/api/tracks
  ```
- [x] Test GET tracks i.e. api/cars
  ```
  curl http://localhost:8000/api/cars
  ```
- [x] Test GET tracks i.e. api/races/${id}
  ```
  curl http://localhost:8000/api/races/1
  ```
- [x] Test POST tracks i.e. api/races
  ```
  curl http://localhost:8000/api/races
  ```
- [x] Test POST tracks i.e. api/races/${id}/start
  ```
  curl http://localhost:8000/api/races/${id}/start
  ```
- [x] Test POST tracks i.e. api/races/${id}/accelerate
  ```
  curl http://localhost:8000/api/races/${id}/accelerate
  ```
   

## Worklog

- [ ] Set up the environment
- [ ] Test the initial setup

#### [handleCreateRace](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)
- [ ] TODO: Get player_id and track_id from the store
- [ ] TODO: const race = invoke the API call to create the race, then save the result
- [ ] TODO: update the store with the race id
- [ ] TODO: call the async function runCountdown
- [ ] TODO: call the async function startRace
- [ ] TODO: call the async function runRace
- [ ] TODO: Make a fetch call (with error handling!) to each of the following API endpoints 


#### [runRace](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: use Javascript's built in setInterval method to get race info every 500ms
- [ ] TODO: if the race info status property is "in-progress", update the leaderboard by calling: renderAt('#leaderBoard', raceProgress(res.positions))
- [ ] TODO: if the race info status property is "finished", run the following:
		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		reslove(res) // resolve the promise
    
#### [runCountdown](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: use Javascript's built in setInterval method to count down once per second
- [ ] TODO: if the countdown is done, clear the interval, resolve the promise, and return
  
#### [handleSelectTrack](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: save the selected track id to the store

#### [handleAccelerate](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: Invoke the API call to accelerate

#### [getTracks](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: Make a fetch GET request to `${SERVER}/api/tracks`
- [ ] Reference: createRace(...)

#### [getRacers](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: Make a fetch GET request to `${SERVER}/api/cars`
- [ ] Reference: createRace(...)

#### [getRace](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: Make a fetch GET request to `${SERVER}/api/races${id}`
- [ ] Reference: createRace(...)

#### [accelerate](https://github.com/rosera/nd032-c3-asynchronous-programming-with-javascript-project-starter/blob/graduation/src/client/assets/javascript/index.js)

- [ ] TODO: Make a fetch POST request to `${SERVER}/api/races/${id}/accelerate`
- [ ] Reference: startRace(...)
