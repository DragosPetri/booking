// Rights required: User
// Scope: User control panel

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { faBookOpen, faRedo, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserProfile from './UserProfile';
import UserBookings from './UserBookings';
import UserRecurrentBookings from './UserRecurrentBookings';
import BlockedUser from '../BlockedUser';

const UserDashboard = () => {
  const { user } = useAuth0();

  const [selectedPage, setSelectedPage] = useState('profile');
  const [userStatus, setUserStatus] = useState('OK');

  let component = null;
  switch (selectedPage) {
    case 'profile':
      component = <UserProfile />;
      break;
    case 'bookings':
      component = <UserBookings />;
      break;
    case 'recurrent':
      component = <UserRecurrentBookings />;
      break;
    default:
      component = <UserProfile />;


      break;
  }

  const getUserStatus = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/status', {
        email: user.email,
      });

      setUserStatus(result.data.status);
    })();
  };

  useEffect(() => { getUserStatus(); }, []);

  if (userStatus !== 'OK') {
    return (
      <div className="container rounded bg-white mt-5 mb-5">
        <BlockedUser />
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button className={selectedPage === 'profile' ? 'nav-link active text-primary' : 'nav-link text-secondary'}
                    onClick={() => { setSelectedPage('profile'); }}>
              <FontAwesomeIcon icon={faUserCircle} /> Profile
            </button>
          </li>
          <li className="nav-item">
            <button className='nav-link text-secondary'>
              <FontAwesomeIcon icon={faBookOpen} /> Manage bookings
            </button>
          </li>
          <li className="nav-item">
            <button className='nav-link text-secondary'>
              <FontAwesomeIcon icon={faRedo} /> Manage recurrent bookings
            </button>
          </li>
        </ul>
        {component}
      </div>
    );
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={selectedPage === 'profile' ? 'nav-link active text-primary' : 'nav-link text-secondary'}
                  onClick={() => { setSelectedPage('profile'); }}>
            <FontAwesomeIcon icon={faUserCircle} /> Profile
          </button>
        </li>
        <li className="nav-item">
          <button className={selectedPage === 'bookings' ? 'nav-link active text-primary' : 'nav-link text-secondary'}
                  onClick={() => { setSelectedPage('bookings'); }}>
            <FontAwesomeIcon icon={faBookOpen} /> Manage bookings
          </button>
        </li>
        <li className="nav-item">
          <button className={selectedPage === 'recurrent' ? 'nav-link active text-primary' : 'nav-link text-secondary'}
                  onClick={() => { setSelectedPage('recurrent'); }}>
            <FontAwesomeIcon icon={faRedo} /> Manage recurrent bookings
          </button>
        </li>
      </ul>
      {component}
    </div>
  );
};

export default UserDashboard;
