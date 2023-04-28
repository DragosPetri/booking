// Navbar user specific links (login/register/user profile/admin profile/etc.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt, faSignOutAlt, faUserPlus, faUsers, faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UserActionList = () => {
  const {
    isAuthenticated, loginWithRedirect, logout, user,
  } = useAuth0();

  const [userRole, setUserRole] = useState('');

  const getUserRole = () => {
    if (isAuthenticated) {
      (async () => {
        const result = await axios.post('http://localhost:9090/api/users/role', {
          email: user.email,
        });

        setUserRole(result.data.role);
      })();
    }
  };

  useEffect(() => { getUserRole(); }, []);

  return (isAuthenticated
    ? (<>
        <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1"
                      data-bs-toggle="dropdown" aria-expanded="false">
        <img
          src={user.picture}
          alt="avatar" width="32" height="32" className="rounded-circle" />
        </a>
        <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
        <li><Link className="dropdown-item" to="/user/dashboard"><FontAwesomeIcon icon={faUsers} /> Dashboard</Link></li>
          {userRole === 'admin' && <li><Link className="dropdown-item" to="/admin/dashboard"><FontAwesomeIcon icon={faUserShield} /> Admin Panel</Link></li>}
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li><button className="dropdown-item text-danger" onClick={() => {
          logout({
            returnTo: window.location.origin,
          });
        }}><FontAwesomeIcon icon={faSignOutAlt} /> Sign out</button></li>
      </ul></>
    )
    : (<>
        <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1"
           data-bs-toggle="dropdown" aria-expanded="false">
          <img
            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="avatar" width="32" height="32" className="rounded-circle" />
        </a>
        <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
        <li><button className="dropdown-item" onClick={async () => { await loginWithRedirect(); }}><FontAwesomeIcon icon={faSignInAlt} /> Log in</button></li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li><button className="dropdown-item" onClick={async () => {
          await loginWithRedirect({
            screen_hint: 'signup',
          });
        }}><FontAwesomeIcon icon={faUserPlus} /> Sign up</button></li>
      </ul></>
    )
  );
};

export default UserActionList;
