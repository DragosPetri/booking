// Component on Centres

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Booking from './Booking';

const CentreCard = (props) => {
  const { data } = props;

  const [bookings, setBookings] = useState([]);

  const getBookings = () => {
    (async () => {
      const result = await axios.get(`http://localhost:9090/api/centres/${data.id}/bookings`);
      if (result.data) {
        const resultFinal = result.data.map((booking) => ({
          ...booking,
          date: new Date(booking.date).toUTCString(),
        }));
        setBookings(resultFinal);
      } else setBookings([]);
    })();
  };

  return (
    <div className="col">
      <div className="card shadow-sm">
        <img className="sport-centre-image" src={data.image_path !== null ? `http://localhost:9090/${data.image_path}` : '../images/default.png'} alt="Not found" />
        <div className="card-body">
          <h5 className="card-title">{data.name}</h5>
          <p className="card-text">{data.description.length >= 250 ? `${data.description.substring(0, 250)}...` : data.description}</p>
          <p className="card-text"><small className="text-muted">Location: {data.location}</small></p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Link to={`centres/${data.id}`} className="btn btn-sm btn-outline-dark" role="button">View</Link>
              <button type="button" className="btn btn-sm btn-outline-dark" onClick={getBookings}>List bookings</button>
            </div>
          </div>
        </div>
        {bookings.length > 0 && <div className="wrapper">
          <div className="card-header">Bookings</div>

          <table className="table">
            <tbody>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
            {bookings.map((booking, index) => <Booking centreId={data.id}
                       data={booking}
                       index={index}
                       key={booking.id}
                       triggerListBookings={getBookings}
              />)}
            </tbody>
          </table>
        </div> }
      </div>
    </div>
  );
};

export default CentreCard;
