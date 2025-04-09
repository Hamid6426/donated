import React from "react";
import { Link } from "react-router-dom";

const VerifySuccess = () => {
  return (
    <div className="verify-container">
      <h2>✅ Account Verified</h2>
      <p>Your email has been successfully verified.</p>
      <Link to="/login" className="btn">
        Go to Login
      </Link>
    </div>
  );
};

export default VerifySuccess;
