import React from 'react';
import { Link } from 'react-router-dom';
import UserActionList from './UserActionList';

const Header = () => (
    <header>
      <div className="collapse bg-dark" id="navbarHeader">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">
              <h4 className="text-white">Sports centre booking</h4>
              <p className="text-muted">Book your classes, pitches and courts</p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4 className="text-white">Useful links</h4>
              <ul className="list-unstyled">
                <li><Link to="/book" className="text-white">Create booking</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center me-auto">
            <img src="/images/running.svg" className="me-2" alt="Logo SVG"/>
            <strong>Sports centre</strong>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader"
                  aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="dropdown text-end ms-5">
            <UserActionList />
          </div>
        </div>
    </div>

    </header>
);

export default Header;
