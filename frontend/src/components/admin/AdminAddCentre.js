// Rights required: Admin
// Scope: Adds a new centre

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import Status404 from '../Status404';

const AdminAddCentre = () => {
  const { user } = useAuth0();

  const [userRole, setUserRole] = useState('');

  const [name, setName] = useState(null);
  const [type, setType] = useState(null);
  const [price, setPrice] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState(null);
  const [statusReturned, setStatusReturned] = useState(null);

  const getUserRole = () => {
    (async () => {
      const result = await axios.post('http://localhost:9090/api/users/role', {
        email: user.email,
      });

      setUserRole(result.data.role);
    })();
  };

  const submitForm = (event) => {
    event.preventDefault();

    (async () => {
      try {
        await axios.put('http://localhost:9090/api/centres', {
          name,
          type,
          price,
          location,
          description,
        });
        setStatusReturned('success');
      } catch (e) {
        setStatusReturned('error');
      }
    })();
  };

  const handleChange = (event) => {
    const { target } = event;

    switch (target.id) {
      case 'name':
        setName(target.value);
        break;
      case 'type':
        setType(target.value);
        break;
      case 'price':
        setPrice(target.value);
        break;
      case 'location':
        setLocation(target.value);
        break;
      case 'description':
        setDescription(target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => { getUserRole(); }, []);

  if (userRole !== 'admin') {
    return <Status404 />;
  }

  return (
    <div className="py5 bg-light">
      <div className="container">
        {statusReturned === 'error'
        && <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>An error occurred while adding the sport centre!</p>
        </div>}
        {statusReturned === 'success'
        && <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Well done!</h4>
          <p>You have successfully added a new sport centre!</p>
        </div>}
        <form className="py-5" onSubmit={submitForm}>
          <div className="w-25">
            <label htmlFor="name" className="form-label">Sport centre name</label>
            <input type="text" id="name" className="form-control" pattern="^.{3,}$" onChange={handleChange} required />
          </div>
          <div className="w-25">
            <label htmlFor="type" className="form-label">Sport centre type</label>
            <input type="text" id="type" className="form-control" pattern="^.{3,}$" onChange={handleChange} required />
          </div>
          <div className="w-25">
            <label htmlFor="price" className="form-label">Price / hour</label>
            <input type="number" id="price" className="form-control" min="0" step="0.01" onChange={handleChange} required />
          </div>
          <div className="w-25">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" id="location" className="form-control" onChange={handleChange} required />
          </div>
          <div className="w-25">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea id="description" className="form-control" rows="3" onChange={handleChange} />
          </div>
          <button type="submit" id="submitUserForm" className="btn btn-danger mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCentre;
