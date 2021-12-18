import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <>
      <div className="error-container container">
        <h1>404</h1>
        <h2>
          Look like you're lost 
        </h2>
        <p>the page you are looking for is not avaible!</p>
        <div className="buttons">
          {/* <Link className="error-btn btn" to="/">Go Login</Link> */}
          <Link className="error-btn btn screen-btn" to="/dashboard">
            Go Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default Error;
