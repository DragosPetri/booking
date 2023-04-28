// Rights required: Admin
// Scope: Admin control panel

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faRedo,
  faSwimmer,
  faUsersCog,
} from '@fortawesome/free-solid-svg-icons';

import Status404 from '../Status404';
import AdminUsers from './AdminUsers';
import AdminCentres from './AdminCentres';
import AdminBookings from './AdminBookings';
import AdminRecurrentBookings from './AdminRecurrentBookings';

const AdminDashboard = () => {
  const { user } = useAuth0();

  const [selectedPage, setSelectedPage] = useState('users');
  const [userRole, setUserRole] = useState('');

  let component = null;
  switch (selectedPage) {
    case 'users':
      component = <AdminUsers />;
      break;
    case 'centres':
      component = <AdminCentres />;
      break;
    case 'bookings':
      component = <AdminBookings />;
      break;
    case 'recurrent':
      component = <AdminRecurrentBookings />;
      break;
    default:
      component = <AdminUsers />;
      break;
  }

  const getUserRole = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/role', {
        email: user.email,
      });

      setUserRole(result.data.role);
    })();
  };

  useEffect(() => { getUserRole(); }, []);

  if (userRole !== 'admin') {
    return <Status404 />;
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={selectedPage === 'users' ? 'nav-link active text-primary' : 'nav-link text-secondary'}
                  onClick={() => { setSelectedPage('users'); }}>
            <FontAwesomeIcon icon={faUsersCog} /> Manage users
          </button>
        </li>
        <li className="nav-item">
          <button className={selectedPage === 'centres' ? 'nav-link active text-primary' : 'nav-link text-secondary'}
                  onClick={() => { setSelectedPage('centres'); }}>
            <FontAwesomeIcon icon={faSwimmer} /> Manage centres
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

export default AdminDashboard;
