# * A React and Express Project using GitHub and GitLab REST APIs*

## *Description of the App*
This is a full-stack web application that interfaces with the GitHub and Gitlab APIs that offers the following capabilities:

* A user search box that provides results from both GitHub and Gitlab platforms.
* User details featuring the username, profile picture, bio, and their latest repositories.
* Repository details including the creation date, description, and the five latest commit dates and descriptions.

### What happens in the back-end ?
The server.js file retrieves profile and repository data for the inputted username from both GitHub and Gitlab APIs. It then organizes this data into object arrays that are accessible to the front-end for fetching.

### What happens in the front-end ?
The App.js file retrieves the inputted username from a form input, then makes requests to the backend using separate endpoints for user profiles and repositories (i.e., /profiles endpoint and /repos endpoint). It manages this data by storing them in corresponding states and utilizes this data to render relevant information within each respective component.

## *How to Install and Setup*
1. Clone this repo and open it with your preferred IDE (VSCode).
2. In your command line navigate to the *server* folder and install the dependencies: `npm install`
2. Open a new/split terminal window and navigate to the *client* folder and install the dependencies: `npm install`
3. In the *server* folder, run the project's server: `npm start`
4. In the *client* folder, run the project's server: `npm start`
5. This should automatically open the React app in your browser. You can also navigate to http://localhost:3001/ in your browser

