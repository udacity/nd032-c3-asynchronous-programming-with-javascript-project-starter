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

| API Call | Parameters |
|----------|------------|
| [GET] api/tracks List of all tracks | id: number (1), name: string ("Executioner"), segments: number[] ([87,47,29,31,78,25,80,76,60,14....]) |
| [GET] api/cars List of all cars | id: number (3), driver_name: string ("Anakin Skywalker") top_speed: number (500) acceleration: number (10) handling: number (10) |
| [GET] api/races/${id} Information about a single race | status: RaceStatus ("unstarted" | "in-progress" | "finished") positions object[] ([{ car: object, final_position: number (omitted if empty), speed: number, segment: number}])  |
| [POST] api/races Create a race | id: number track: string player_id: number cars: Cars[] (array of cars in the race) results: Cars[] (array of cars in the position they finished, available if the race is finished) |
| [POST] api/races/${id}/start Begin a race | Returns nothing |
| [POST]  api/races/${id}/accelerate Accelerate a car | Returns nothing |
