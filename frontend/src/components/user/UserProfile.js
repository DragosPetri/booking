// Rights required: User
// Scope: Profile details of user

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Accordion } from 'react-bootstrap';
import axios from 'axios';

import AccordionBooking from '../AccordionBookings';

const UserProfile = () => {
  const { user } = useAuth0();
  const { picture, email } = user;

  const [userMetadata, setUserMetadata] = useState({ name: '', role: '', status: '' });
  const [userBookings, setUserBookings] = useState([]);

  const [editName, setEditName] = useState(false);
  const [inputName, setInputName] = useState(null);

  const getUserMetadata = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/', {
        email,
      });

      setUserMetadata(result.data);
      setInputName(result.data.name);
    })();
  };

  const getUserBookings = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/bookings', {
        email,
      });

      const resultFinal = result.data.map((booking) => ({
        ...booking,
        date: new Date(booking.date).toUTCString(),
      }));

      setUserBookings(resultFinal);
    })();
  };

  useEffect(() => { getUserMetadata(); }, []);
  useEffect(() => { getUserBookings(); }, []);

  const handleChangeName = () => {
    (async () => {
      await axios.patch('http://localhost:9090/api/users/name', {
        email,
        name: inputName,
      });
    })();

    setEditName(false);
    setUserMetadata({ name: inputName, role: userMetadata.role });
  };

  return (
    <div className="row">
      <div className="col-md-3 border-right">
        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
          <img className="rounded-circle mt-5" width="150px" src={picture} alt="Not found" />
          <span className="font-weight-bold">{userMetadata.name}</span><span className="text-black-50">{email}</span>
        </div>
      </div>
      <div className="col-md-5 border-right">
        <div className="p-3 py-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-right">Profile Settings</h4>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-text text-danger">Full name</span>
                {
                  editName
                    ? <><input type="text" className="form-control" placeholder="User name"
                           value={inputName} onChange={(e) => { setInputName(e.target.value); }} />
                    <button className="btn btn-outline-success" type="button" onClick={() => { handleChangeName(); }}>Submit</button></>
                    : <><input type="text" className="form-control" placeholder="User name"
                  value={userMetadata.name} disabled />
                  <button className="btn btn-outline-danger" type="button" onClick={() => { setEditName(true); }}>Edit</button></>
                }
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-text text-danger">Email</span>
                <input type="text" className="form-control" placeholder="User email"
                       value={email} disabled />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-text text-danger">Role</span>
                <input type="text" className="form-control" placeholder="User role"
                       value={userMetadata.role} disabled />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-text text-danger">Status</span>
                <input type="text" className="form-control" placeholder="User status"
                       value={userMetadata.status} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-3 py-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-right">Upcoming Bookings</h4>
          </div>
          <Accordion defaultActiveKey="0">
            {userBookings
              .filter((booking) => new Date(booking.date) > new Date(Date.now()))
              .map((booking, i) => <AccordionBooking data={booking} index={i} key={booking.id} />)}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
