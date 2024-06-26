import React from "react";
import Button from "react-bootstrap/Button"; // Importing Button component from react-bootstrap
import Form from "react-bootstrap/Form"; // Importing Form component from react-bootstrap

// Functional component SearchBar for receiving props: getUser, handleChange, searchName, option, handleOption
export default function SearchBar({
  getUser, // Function to fetch the user data
  handleChange, // Function to handle the input change
  searchName, // State to store the search input value
  option, // State to determine GitHub or GitLab view
  handleOption, // Function to handle a option change
}) {
  return (
    <>
      {/* Form section for user input */}
      <div className="formSection mt-4 pt-4">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label className="display-6 pb-4">Enter username:</Form.Label>
            {/* Input field for a username */}
            <Form.Control
              className="mb-4"
              type="text"
              value={searchName} // Bind input value to searchName state
              onChange={handleChange} // Call handleChange function on input change
            />
          </Form.Group>
          {/* Button to trigger the getUser function */}
          <Button
            className="btn btn-lg searchButton"
            variant="secondary"
            type="button"
            onClick={getUser} // Call getUser function on button click
          >
            Search
          </Button>
        </Form>
      </div>

      {/* Option section for selecting to view GitHub or GitLab  */}
      <div className="choiceDiv my-5">
        {/* Option to view GitHub */}
        <div
          className={option ? "choiceItem" : "choiceItem selected"} // Conditionally apply classes based on option state
          onClick={() => handleOption(0)} 
        >
          View GitHub
        </div>
        {/* Option to view GitLab */}
        <div
          className={option ? "choiceItem selected" : "choiceItem"} // Conditionally apply classes based on the option state
          onClick={() => handleOption(1)} 
        >
          View GitLab
        </div>
      </div>
    </>
  );
}
