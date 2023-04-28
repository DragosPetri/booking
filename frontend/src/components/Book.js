// Rights required: User
// Scope: Create a booking

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';

import BlockedUser from './BlockedUser';

const Book = () => {
  const { user } = useAuth0();

  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusReturned, setStatusReturned] = useState(null);
  const [recurrentChecked, setRecurrentChecked] = useState(false);

  const [bookedDates, setBookedDates] = useState([]);
  const [userStatus, setUserStatus] = useState('OK');

  const getCentreOptions = () => {
    (async () => {
      const result = await axios.get('http://localhost:9090/api/centres');
      if (result.data.length) {
        setCentres(result.data);
      }
    })();
  };

  const getUserStatus = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/status', {
        email: user.email,
      });

      setUserStatus(result.data.status);
    })();
  };

  const submitForm = (event) => {
    event.preventDefault();

    (async () => {
      try {
        await axios.put(`http://localhost:9090/api/centres/${selectedCentre.value.id}/bookings/`, {
          email: user.email,
          date: selectedDate,
          recurrent: recurrentChecked,
        });
        setStatusReturned('success');
      } catch (e) {
        setStatusReturned('error');
      }
    })();
  };

  useEffect(() => { getCentreOptions(); }, []);
  useEffect(() => { getUserStatus(); }, []);
  // Get the bookings for the selected day at the selected centre
  useEffect(() => {
    if (selectedCentre && selectedDate) {
      (async () => {
        const result = await axios.post(`http://localhost:9090/api/centres/${selectedCentre.value.id}/bookings/dates`, {
          date: selectedDate,
        });
        if (result.data.length > 0) {
          const resultFinal = result.data.map((booking) => ({
            startDate: moment(booking.startDate).format('lll'),
            endDate: moment(booking.endDate).format('lll'),
          }));
          setBookedDates(resultFinal);
        }
      })();
    }
  }, [selectedDate]);
  useEffect(() => { setBookedDates([]); }, [selectedCentre]);

  if (userStatus !== 'OK') return <BlockedUser />;
  return (
    <div className="container-fluid row py-5 bg-light">
      <div className="col-md-3 border-right">
        <div className="d-flex flex-column align-items-center text-center">
          <img width="300px" src={selectedCentre !== null && selectedCentre.value !== undefined && selectedCentre.value.image_path !== null ? `http://localhost:9090/${selectedCentre.value.image_path}` : '/images/default.png'} alt="Not found" />
          <span className="font-weight-bold">{selectedCentre !== null && selectedCentre.value !== undefined ? selectedCentre.value.name : 'Nothing'}</span>
        </div>
      </div>
      <div className="col-md-5 border-right">
        {statusReturned === 'error'
        && <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>If you selected a sport centre, then the booking already exists.!</p>
        </div>}
        {statusReturned === 'success'
        && <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Well done!</h4>
          <p>You have successfully created a booking at the selected sport centre!</p>
        </div>}
        <form onSubmit={submitForm}>
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
                 aria-label="Info:">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>            </svg>
            <div>
              Every reservation guarantees 2 hours of training.
            </div>
          </div>
          <div className="py-2">
            <Select
              value={selectedCentre}
              onChange={(option) => setSelectedCentre(option) }
              options={
                centres.map((centre) => ({ value: centre, label: centre.name }))
              }
            />
          </div>

          <div>
            <label htmlFor="centreBookDate" className="form-label">When?</label>
            {selectedCentre
              ? <input type="datetime-local" className="form-control" id="centreBookDate" name="centreBookDate"
                     onChange={(e) => {
                       setSelectedDate(e.target.value);
                     }} required/>
              : <input type="datetime-local" className="form-control" id="centreBookDate" name="centreBookDate"
                     disabled required/>
            }
          </div>

          <div className="form-check pt-3">
            <input className="form-check-input" type="checkbox" value="" id="recurrent" onChange={() => { setRecurrentChecked(!recurrentChecked); }} />
              <label className="form-check-label" htmlFor="recurrent">
                Recurrent?
              </label>
          </div>

          <hr className="w-25" />
          {selectedCentre
            ? <button type="submit" id="submitUserForm" className="btn btn-danger mt-2">Submit</button>
            : <button type="submit" id="submitUserForm" className="btn btn-danger mt-2" disabled>Submit</button>
          }
        </form>
      </div>
      <div className="col-md-4">
        <div>
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                 className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
                 aria-label="Info:">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>            </svg>
            <div>
              Select a date to display the already booked dates.
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-right">Reserved times</h4>
          </div>
          <table className="table table-dark table-striped table-hover">
            <thead>
            <tr>
              <th>#</th>
              <th>Start</th>
              <th>End</th>
            </tr>
            </thead>
            <tbody>
            {bookedDates.length > 0 && bookedDates.map((item, index) => <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
            </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Book;
