// Displayed on components if user is banned

import React from 'react';

const BlockedUser = () => (
  <div className="container rounded bg-white mt-5 mb-5">
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Limited account</h4>
      <p>Your account has been banned by an administrator,
        so you can access only the limited features of the website.</p>
      <hr />
      <p>We are sorry!</p>
    </div>
  </div>
);

export default BlockedUser;
