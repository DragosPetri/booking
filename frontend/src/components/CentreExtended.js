// Detailed view of centre

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import axios from 'axios';

const CentreExtended = () => {
  const { id } = useParams();

  const [centre, setCentre] = useState({});

  const getCentre = () => {
    (async () => {
      const result = await axios.get(`http://localhost:9090/api/centres/${id}`);
      setCentre(result.data);
    })();
  };

  useEffect(() => { getCentre(); }, []);

  return (
    <div className="container">
      <h6><Link to="/">Go back to the landing page</Link></h6>
      <div className="card mb-3" style={{ maxWidth: '1000px' }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img style={{ height: '225px', width: '100%' }} src={centre !== null && centre.image_path !== null ? `http://localhost:9090/${centre.image_path}` : '/images/default.png'} alt="Not found" />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">
                {centre.name}
              </h5>
              <p className="card-text">
                {centre.description}
              </p>
              <p className="card-text lead">
                <small className="text-muted">Type: {centre.type}</small><br />
                <small className="text-muted">Location: {centre.location}</small><br />
                <small className="text-muted">Price: {centre.price} Euro / Hour</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreExtended;
