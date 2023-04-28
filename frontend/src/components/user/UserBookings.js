// Rights required: User
// Scope: Lists all the bookings

import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const UserBookings = () => {
  const { user } = useAuth0();
  const { email } = user;

  const [bookings, setBookings] = useState([]);

  const columns = [
    { dataField: 'id', text: 'Booking id' },
    { dataField: 'name', text: 'Centre name' },
    { dataField: 'date', text: 'Booking Date' },
    { dataField: 'recurrent', text: 'Recurrent' },
  ];

  const getUserBookings = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/bookings', {
        email,
      });
      const resultFinal = result.data.map((booking) => ({
        ...booking,
        date: new Date(booking.date).toUTCString(),
      }));

      setBookings(resultFinal);
    })();
  };

  useEffect(() => { getUserBookings(); }, []);

  const deleteBooking = (id) => {
    (async () => {
      await axios.delete('http://localhost:9090/api/users/bookings', {
        data: { id, email },
      });
      getUserBookings(); // refresh table data
    })();
  };

  const expandRow = {
    // eslint-disable-next-line react/display-name
    renderer: (row) => (
      <div className="list-group">
        <span className="list-group-item list-group-item-action list-group-item-danger d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Delete booking</h5>
            <p className="mb-1">This action is permanent.</p>
          </div>
          <button type="button" onClick={() => { deleteBooking(row.id); }} className="btn btn-danger align-self-center">Delete</button>
        </span>
      </div>
    ),
    onlyOneExpanding: true,
    expandByColumnOnly: true,
    expandColumnPosition: 'right',
    showExpandColumn: true,
    // eslint-disable-next-line react/display-name
    expandColumnRenderer: ({ expandable }) => (expandable
      && <button type="button" onClick={onclick} className="btn btn-danger">Edit</button>),
    // eslint-disable-next-line react/display-name
    expandHeaderColumnRenderer: () => (
      <div onClick={(e) => { e.stopPropagation(); }}>Actions</div>
    ),
  };

  return (
    <div className="row">
      <BootstrapTable
        striped
        hover
        keyField='id'
        data={bookings}
        columns={columns}
        expandRow={ expandRow }
        pagination={paginationFactory({ prePageText: 'Previous', nextPageText: 'Next' })}
      />
    </div>
  );
};

export default UserBookings;
