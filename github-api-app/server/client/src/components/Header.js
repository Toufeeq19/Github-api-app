//Header.js
import React from "react";

// Component Header
export default function Header() {
  return (
    // Header section with padding
    <div className="headerSection py-5">
      {/* Main title */}
      <h1 className="headerTitle py-3  display-2">GitHub & GitLab Search</h1>
      {/* Description paragraph */}
      <p className="headerDescription w-75 mx-auto py-3">
        {/* Explanation of the functionality */}
        Discover GitHub and GitLab users by entering their username into the
        search bar.
        <br></br>
        {/* Instructions for usage */}
        Toggle between 'View GitHub' and 'View GitLab' to access user profiles
        and repository details.
      </p>
    </div>
  );
}
