// Booking on CentreCard

import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Booking = (props) => {
  const { user, isAuthenticated } = useAuth0();

  const deleteBooking = () => {
    (async () => {
      if (isAuthenticated) {
        await axios.delete('http://localhost:9090/api/users/bookings', { data: { id: props.data.id, email: user.email } });
        props.triggerListBookings();
      }
    })();
  };

  return (
    <tr key={props.data.id}>
      <td>{props.index + 1}</td>
      <td>{props.data.date}</td>
      <td>
        {isAuthenticated
          ? <button type="button" className="btn btn-sm btn-outline-danger" onClick={deleteBooking}>Delete</button>
          : <button type="button" className="btn btn-sm btn-outline-danger" disabled>Delete</button>
        }

      </td>
    </tr>
  );
};

export default Booking;
