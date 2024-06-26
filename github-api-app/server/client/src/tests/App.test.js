// Imports the necessary modules and components for testing
import React from "react";
import renderer from "react-test-renderer";
import App from "../App"; // Importing the main App component
import Header from "../components/Header"; // Imports the Header component

// Test case: Ensure Header component renders correctly
test("Header component renders correctly", () => {
  const tree = renderer.create(<Header />).toJSON(); // Create a snapshot of the Header component
  expect(tree).toMatchSnapshot(); // Compare the snapshot to ensure that it remains unchanged
});

// Test case: Ensure main App component renders correctly
test("main component renders correctly", () => {
  const tree = renderer.create(<App />).toJSON(); // Creates a snapshot of the main App component
  expect(tree).toMatchSnapshot(); // Compares the snapshot to ensure that it remains unchanged
});

// Test case: Ensure user is found at searchUser endpoint
test("user is found at searchUser endpoint", () => {
  let searchName = process.env.REACT_APP_SEARCH_NAME; // Gets searchName from environment variables
  // Fetch data from searchUser endpoint with the provided searchName
  return fetch(`http://localhost:3000/searchUser/${searchName}`)
    .then((response) => response.json())
    .then((data) => {
      expect(data.data[0].userFound).toBe(true); // Verifies that the userFound is true in the fetched data
    });
});

// Test case: Ensure projects are found at getRepos endpoint
test("projects are found at getRepos endpoint", () => {
  let searchName = process.env.REACT_APP_SEARCH_NAME; // Gets the searchName from environment variables
  // Fetch data from getRepos endpoint with the provided searchName
  return fetch(`http://localhost:3000/searchUser/${searchName}/repos`)
    .then((response) => response.json()) // Parses response
    .then((data) => {
      expect(data.msg).toContain("Repos found for username"); // Verifies that the response message contains "Repos found for username"
    });
}, 60000); // Sets timeout to 60 seconds for this test
