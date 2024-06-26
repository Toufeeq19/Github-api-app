// Required Dependencies
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const fetch = require("node-fetch");

// Initializes the Express App
const app = express();

// Middleware setup
app.use(helmet()); // Helmet middleware for securing the HTTP headers.
app.use(cors()); // CORS middleware for enabling cross-origin requests.
app.use(express.json()); // Middleware to parse JSON request bodies.

// Defining the port for the server to listen on
const port = process.env.PORT || 3001;

// Endpoint to search for users profiles on GitHub and GitLab.
app.get("/searchUser/:name", async (req, res) => {
  let profilesData = [];

  // Fetches GitHub user profile.
  let gitHubProfileResponse = await fetch(
    `https://api.github.com/users/${req.params.name}`
  );
  let gitHubProfileData = await gitHubProfileResponse.json();

  // Fetches GitLab user profile data.
  let gitLabProfileResponse = await fetch(
    `https://gitlab.com/api/v4/users?username=${req.params.name}`
  );
  let gitLabProfileData = await gitLabProfileResponse.json();

  // Processes the GitHub profile data.
  if (gitHubProfileData.message === "Not Found") {
    // If GitHub user is not found it creates a profile object indicating so.
    let gitHubProfile = {
      userFound: false,
      gitHubAvatar: "",
      gitHubUserName: "",
      gitHubProfileLink: "",
      gitHubBio: "",
    };
    profilesData.push(gitHubProfile);
  } else {
    // If GitHub user is found it then creates a profile object with the relevant data.
    let gitHubProfile = {
      userFound: true,
      gitHubAvatar: gitHubProfileData.avatar_url,
      gitHubUserName: gitHubProfileData.login,
      gitHubProfileLink: gitHubProfileData.url,
      gitHubBio: gitHubProfileData.bio,
    };
    profilesData.push(gitHubProfile);
  }

  // Processes GitLab profile data.
  if (gitLabProfileData < 1) {
    // If GitLab user not found it creates a profile object indicating so.
    let gitLabProfile = {
      userFound: false,
      gitLabAvatar: "",
      gitLabUserName: "",
      gitLabProfileLink: "",
    };
    profilesData.push(gitLabProfile);
  } else {
    // If GitLab user is found it creates a profile object with relevant data (assuming GitLabProfileData is an array).
    let gitLabProfile = {
      userFound: true,
      gitLabAvatar: gitLabProfileData[0].avatar_url,
      gitLabUserName: gitLabProfileData[0].username,
      gitLabProfileLink: gitLabProfileData[0].web_url,
    };
    profilesData.push(gitLabProfile);
  }

  // Responds with appropriate message and profile data.
  if (profilesData < 1) {
    // If no profiles are found it sends custom response indicating user not found.
    let customResponse = {
      msg: `User not found! There are no users with the name "${req.params.name}" on GitLab or GitHub. `,
    };
    res.send(customResponse);
  } else {
    // If profiles are found it sends custom response with relevant data.
    let customResponse = {
      msg: `User found: ${req.params.name}`,
      data: profilesData,
    };
    res.send(customResponse);
  }
});

// Endpoint to fetch the repositories for a user from GitHub and GitLab.
app.get("/searchUser/:name/repos", async (req, res) => {
  let reposData = [{ gitHubProjects: [] }, { gitLabProjects: [] }];

  // Fetches GitHub repositories data.
  const gitHubRepoResponse = await fetch(
    `https://api.github.com/users/${req.params.name}/repos?per_page=5&sort=pushed`
  );
  const gitHubRepoData = await gitHubRepoResponse.json();

  // Fetches GitLab repositories data.
  let gitLabRepoResponse = await fetch(
    `https://gitlab.com/api/v4/users/${req.params.name}/projects?per_page=5`
  );
  let gitLabRepoData = await gitLabRepoResponse.json();

  // Process GitHub repositories data.
  if (gitHubRepoData.message === "Not Found") {
    // If no GitHub repositories are found, add placeholder object to the reposData.
    const gitHubRepo = {
      repoFound: false,
      repoName: "",
      repoDescription: "",
      dateCreated: "",
      commitMessages: "",
    };

    reposData[0].gitHubProjects.push(gitHubRepo);
  } else {
    // Loops through GitHub repositories and fetches commit data for each.
    for (let i = 0; i < gitHubRepoData.length; i++) {
      let repoCommits = await fetch(
        `https://api.github.com/repos/${req.params.name}/${gitHubRepoData[i].name}/commits?per_page=5`
      );
      let commitsData = await repoCommits.json();

      // Creates a repository object with the relevant data.
      const gitHubRepo = {
        repoFound: true,
        repoName: gitHubRepoData[i].name,
        repoDescription: gitHubRepoData[i].description,
        dateCreated: gitHubRepoData[i].created_at.substr(0, 10),
        commitMessages: [],
      };

      // Process commits the data and adds it to the repository object.
      for (let j = 0; j < commitsData.length; j++) {
        let tempCommit = {
          commitMsg: commitsData[j].commit.message.substr(0, 100),
          commitDate: commitsData[j].commit.author.date.substr(0, 10),
        };
        gitHubRepo.commitMessages.push(tempCommit);
      }

      // Pushes the repository object into the reposData array.
      reposData[0].gitHubProjects.push(gitHubRepo);
    }
  }

  // Processes the GitLab repositories data.
  if (gitLabRepoData.message === "404 User Not Found") {
    // If no GitLab repositories are a found it adds a placeholder object to the reposData.
    const gitLabRepo = {
      repoFound: false,
      repoName: "",
      repoDescription: "",
      dateCreated: "",
      commitMessages: "",
    };

    reposData[1].gitLabProjects.push(gitLabRepo);
  } else {
    // Loops through the GitLab repositories and fetches commit data for each.
    for (let i = 0; i < gitLabRepoData.length; i++) {
      let repoCommits = await fetch(
        `https://gitlab.com/api/v4/projects/${gitLabRepoData[i].id}/repository/commits?per_page=5`
      );
      let commitsData = await repoCommits.json();

      // Creates a repository object with the relevant data.
      const gitLabRepo = {
        repoFound: true,
        repoName: gitLabRepoData[i].name,
        repoDescription: gitLabRepoData[i].description,
        dateCreated: gitLabRepoData[i].created_at.substr(0, 10),
        commitMessages: [],
      };

      // Process commits data and adds it to the repository object.
      for (let j = 0; j < commitsData.length; j++) {
        let tempCommit = {
          commitMsg: commitsData[j].title.substr(0, 100),
          commitDate: commitsData[j].created_at.substr(0, 10),
        };
        gitLabRepo.commitMessages.push(tempCommit);
      }

      // Pushes repository object into reposData array.
      reposData[1].gitLabProjects.push(gitLabRepo);
    }
  }

  // Responds with an appropriate message and repository data.
  if (reposData < 1) {
    // If no repositories are found it sends a custom response indicating that the repos are not found.
    let customResponse = {
      msg: `User repos not found! There are no repos for the username "${req.params.name}" on GitLab or GitHub. `,
    };
    res.send(customResponse);
  } else {
    // If repositories are found it sends a custom response with the data.
    let customResponse = {
      msg: `Repos found for username: "${req.params.name}"`,
      data: reposData,
    };
    res.send(customResponse);
  }
});

// Start server and listen on port 3001
module.exports = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
