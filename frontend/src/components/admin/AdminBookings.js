// Rights required: Admin
// Scope: Lists all the bookings

import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

const AdminBookings = () => {
  const { user } = useAuth0();
  const { email } = user;

  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [names, setNames] = useState([]);

  const columns = [
    { dataField: 'id', text: 'Booking id' },
    { dataField: 'user_email', text: 'User email' },
    { dataField: 'name', text: 'Centre name' },
    { dataField: 'date', text: 'Booking Date' },
    { dataField: 'recurrent', text: 'Recurrent' },
  ];

  const getBookings = () => {
    (async () => {
      const result = await axios.get('http://localhost:9090/api/centres/bookings');
      const resultFinal = result.data.map((booking) => ({
        ...booking,
        date: new Date(booking.date).toUTCString(),
      }));
      setBookings(resultFinal);
      setNames([...new Set(result.data.map((item) => item.name))]);
    })();
  };

  useEffect(() => { getBookings(); }, []);

  const deleteBooking = (id) => {
    (async () => {
      await axios.delete('http://localhost:9090/api/users/bookings', {
        data: { id, email },
      });
      getBookings(); // refresh table data
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
            <small className="text-muted">This will cancel the user&lsquo;s plan.</small>
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
    <>
      <div className="row my-3">
        <div className="input-group">
          <div className="input-group align-self-center">
            <Select
              value={filtered}
              className="w-25 ms-4"
              placeholder='Filter by centre name...'
              onChange={(option) => { setFiltered(option); }}
              options={
                names.map((item) => ({ value: item, label: item }))
              }
            />
            <button type="button" className="btn btn-warning" onClick={() => { setFiltered(null); }}>
              <FontAwesomeIcon icon={faEraser} />
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <BootstrapTable
          striped
          hover
          keyField='id'
          data={bookings.filter((booking) => filtered === null || booking.name === filtered.value)}
          columns={columns}
          expandRow={ expandRow }
          pagination={paginationFactory({ prePageText: 'Previous', nextPageText: 'Next' })}
        />
      </div>
    </>
  );
};

export default AdminBookings;
