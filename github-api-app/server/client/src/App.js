//App.js
// Importing the necessary modules and components
import "./components/Custom.css";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import GitHubResults from "./components/GitHubResults";
import Header from "./components/Header";
import GitLabResults from "./components/GitLabResults";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/cjs/ListGroupItem";

function App() {
  // State variables for storing user profiles, GitHub data, GitLab data, search input, selected option, and the loading states
  const [userProfiles, setUserProfiles] = useState();
  const [gitHubAvatar, setGitHubAvatar] = useState();
  const [gitHubName, setGitHubName] = useState();
  const [gitHubProfileLink, setGitHubProfileLink] = useState();
  const [gitHubBio, setGitHubBio] = useState();
  const [gitHubRepoData, setGitHubRepoData] = useState();
  const [gitLabAvatar, setGitLabAvatar] = useState();
  const [gitLabName, setGitLabName] = useState();
  const [gitLabProfileLink, setGitLabProfileLink] = useState();
  const [gitLabRepoData, setGitLabRepoData] = useState();
  const [searchName, setSearchName] = useState("");
  const [option, setOption] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);

  // Function to fetch the user profiles from the server
  async function getUser() {
    setLoading(true);

    // Fetches user profiles based on user search input
    let response = await fetch(`/searchUser/${searchName}`);
    let profilesData = await response.json();

    // Update state with fetched GitHub and GitLab profile data
    setUserProfiles(profilesData.data);
    setGitHubName(profilesData.data[0].gitHubUserName);
    setGitHubProfileLink(profilesData.data[0].gitHubProfileLink);
    setGitHubAvatar(profilesData.data[0].gitHubAvatar);
    setGitHubBio(profilesData.data[0].gitHubBio);
    setGitLabName(profilesData.data[1].gitLabUserName);
    setGitLabProfileLink(profilesData.data[1].gitLabProfileLink);
    setGitLabAvatar(profilesData.data[1].gitLabAvatar);

    setLoading(false);

    // Call function to fetch repositories for the user
    getRepos(searchName);
  }

  // Function to fetch repositories for the user from GitHub and GitLab
  async function getRepos(searchName) {
    setLoadingRepos(true);

    // Fetch repositories data for the user from GitHub and GitLab
    let response = await fetch(`/searchUser/${searchName}/repos`);
    let repoData = await response.json();

    // Extracts GitHub and GitLab repositories lists from the fetched data
    let gitHubRepoList = repoData.data[0].gitHubProjects;
    let gitLabRepoList = repoData.data[1].gitLabProjects;

    // Process GitHub repositories data
    for (let i = 0; i < gitHubRepoList.length; i++) {
      if (gitHubRepoList[i].repoFound === true) {
        // Map GitHub repositories to JSX elements with the repository details
        let gitHubRepoInfo = gitHubRepoList.map((repo, index) => {
          return (
            <ListGroup key={index} className="text-start">
              <ListGroup.Item className="repoList">
                <div className="repoTitle">{repo.repoName}</div>
                <div className="pb-2">Created on: {repo.dateCreated}</div>
                <div className="repoDescription pb-2">
                  Description:
                  <br></br>
                  {repo.repoDescription}
                </div>
                <div>
                  <span className="latestCommitsHeading">
                    Latest Commit Messages:
                  </span>
                  <br></br>
                  {/* Map commit messages for each repository */}
                  {repo.commitMessages.map((message, index) => {
                    return (
                      <ListGroup.Item className="repoCommits" key={index}>
                        {message.commitDate}:<br></br>
                        {message.commitMsg}
                      </ListGroup.Item>
                    );
                  })}
                </div>
              </ListGroup.Item>
            </ListGroup>
          );
        });

        // Updates the state with GitHub repository JSX elements
        setGitHubRepoData(gitHubRepoInfo);
      } else {
        // If no GitHub repositories are found it displays a message
        let noReposMsg = (
          <ListGroup>
            <ListGroupItem>
              No GitHub repos were found for this user
            </ListGroupItem>
          </ListGroup>
        );
        setGitHubRepoData(noReposMsg);
      }
    }

    // Process GitLab repositories data
    for (let i = 0; i < gitLabRepoList.length; i++) {
      if (gitLabRepoList[i].repoFound === true) {
        // Map GitLab repositories to JSX elements with repository details
        let gitLabRepoInfo = gitLabRepoList.map((repo, index) => {
          return (
            <ListGroup key={index} className="text-start">
              <ListGroup.Item className="repoList">
                <div className="repoTitle">{repo.repoName}</div>
                <div className="pb-2">Created on: {repo.dateCreated}</div>
                <div className="repoDescription pb-2">
                  Description:
                  <br></br>
                  {repo.repoDescription}
                </div>
                <div>
                  <span className="latestCommitsHeading">
                    Latest Commit Messages:
                  </span>
                  <br></br>
                  {/* Map commit messages for each repository */}
                  {repo.commitMessages.map((message, index) => {
                    return (
                      <ListGroup.Item className="repoCommits" key={index}>
                        {message.commitDate}:<br></br>
                        {message.commitMsg}
                      </ListGroup.Item>
                    );
                  })}
                </div>
              </ListGroup.Item>
            </ListGroup>
          );
        });

        // Updates the state with GitLab repository JSX elements
        setGitLabRepoData(gitLabRepoInfo);
      } else {
        // If no GitLab repositories were found it displays a message
        let noReposMsg = (
          <ListGroup>
            <ListGroupItem>
              No GitLab repos were found for this user
            </ListGroupItem>
          </ListGroup>
        );
        setGitLabRepoData(noReposMsg);
      }
    }

    setLoadingRepos(false);
  }

  // Function to handle input change in the search bar
  const handleChange = (e) => {
    setSearchName(e.target.value);
  };

  // Function to handle option change (GitHub or GitLab)
  const handleOption = (e) => {
    setOption(e);
  };

  // Renderes the main application structure
  return (
    <div className="App">
      <Header /> {/* Renderes the header component */}
      <div className="App justify-content-center align-items-center d-flex flex-column">
        <SearchBar
          getUser={getUser}
          handleChange={handleChange}
          searchName={searchName}
          option={option}
          handleOption={handleOption}
        />{" "}
        {/* Renderes the search bar component */}
        {loading ? ( // Conditionally render loading message while fetching data
          <p>Loading...</p>
        ) : option ? ( // Conditionally render GitLab results if option is true
          <GitLabResults
            userProfiles={userProfiles}
            gitLabAvatar={gitLabAvatar}
            gitLabName={gitLabName}
            gitLabProfileLink={gitLabProfileLink}
            searchName={searchName}
            gitLabRepoData={gitLabRepoData}
            loadingRepos={loadingRepos}
          />
        ) : (
          // Otherwise it will render GitHub results
          <GitHubResults
            userProfiles={userProfiles}
            gitHubAvatar={gitHubAvatar}
            gitHubName={gitHubName}
            gitHubProfileLink={gitHubProfileLink}
            gitHubBio={gitHubBio}
            searchName={searchName}
            gitHubRepoData={gitHubRepoData}
            loadingRepos={loadingRepos}
          />
        )}
      </div>
    </div>
  );
}

export default App;
