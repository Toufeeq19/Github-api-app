import React from "react";
import Card from "react-bootstrap/Card"; // Importing Card component from react-bootstrap

// Component for GitLabResults, receiving props: userProfiles, gitLabAvatar, gitLabName, gitLabProfileLink, searchName, gitLabRepoData, loadingRepos
export default function GitLabResults({
  userProfiles, // Array containing user profiles data from GitHub and GitLab
  gitLabAvatar, // URL for GitLab user's Profile Image
  gitLabName, // GitLab username
  gitLabProfileLink, // Link to GitLab user's profile
  searchName, // Username being searched
  gitLabRepoData, // Data containing GitLab repositories and commits
  loadingRepos, // Boolean indicating if repositories are loading or not 
}) {
  // If userProfiles is not yet defined (initial state), returns an empty paragraph
  if (!userProfiles) {
    return <p></p>;
  }
  // If userProfiles is defined but userFound for GitLab (index 1) is false
  else if (userProfiles[1].userFound === false) {
    // Rendering a card component indicating that no user is found on GitLab
    return (
      <div>
        <Card style={{ width: "30rem" }}>
          <Card.Body>
            <Card.Title className="py-2 fs-2">
              There are no users with the username "{searchName}" on GitLab.
            </Card.Title>
          </Card.Body>
        </Card>
      </div>
    );
  }
  // If userProfiles is defined and userFound for GitLab (index 1) is true
  else {
    // Rendering card component displaying GitLab user information and repositories
    return (
      <div>
        <Card style={{ width: "30rem" }}>
          <Card.Body>
            <Card.Title className="py-2 fs-2 d-flex align-items-center justify-content-center">
              {/* Displays GitLab user's Profile Image */}
              <Card.Img
                variant="top"
                className="rounded-circle w-25"
                src={gitLabAvatar}
              />
              {/* Display GitLab user's name as a link to the users profile */}
              &nbsp;&nbsp;
              <Card.Link
                className="profileName"
                href={gitLabProfileLink}
                target="blank"
              >
                {gitLabName}
              </Card.Link>
            </Card.Title>
          </Card.Body>
          <Card.Body>
            {/* Section heading for repositories and commits */}
            <Card.Title className="reposHeading">
              Latest Repos & Commits
            </Card.Title>
            {/* Displays a loading message when repositories are loading otherwise displays the GitLab repository data */}
            {loadingRepos ? <p>Repos Loading...</p> : gitLabRepoData}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
