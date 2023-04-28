// Default page, lists all existent centres

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEraser } from '@fortawesome/free-solid-svg-icons';

import Select from 'react-select';
import CentreCard from './CentreCard';

const Centres = () => {
  const { user, isAuthenticated } = useAuth0();

  const [centres, setCentres] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filtered, setFiltered] = useState(null);

  let searchBy = '';

  const checkUser = () => {
    (async () => {
      if (isAuthenticated) {
        await axios.put('http://localhost:9090/api/users/', {
          user,
        });
      }
    })();
  };

  const getCentres = () => {
    (async () => {
      const result = await axios.get('http://localhost:9090/api/centres');

      setCentres(result.data);
      // ES6 spread operator with set... and get only types from result.data
      setTypes([...new Set(result.data.map((item) => item.type))]);
    })();
  };

  const handleSearch = () => {
    if (searchName === '') getCentres();
    else {
      const filteredSearch = centres
        .filter((centre) => centre.name.toLowerCase().includes(searchName.toLowerCase()));
      setCentres(filteredSearch);
    }
  };

  // Egyszer hivodik meg, mivel konstans a masodk parameter
  useEffect(() => { checkUser(); }, []);
  useEffect(() => { getCentres(); }, []);
  useEffect(() => { handleSearch(); }, [searchName]);

  return (
    <div className="album py-5 bg-light">
      <div className="container">
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <div className="input-group">
              <div className="input-group align-self-center">
                <input type="text" className="form-control" placeholder="Search by centre name..." onChange={(e) => { searchBy = e.target.value; }} />
                <button type="button" className="btn btn-primary" onClick={() => { setSearchName(searchBy); }}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                <button type="button" className="btn btn-warning" onClick={() => { setSearchName(''); }}>
                  <FontAwesomeIcon icon={faEraser} />
                </button>
              </div>
            </div>
          </li>
          <li className="nav-item w-50">
            <div className="input-group">
              <div className="input-group align-self-center">
                <Select
                  value={filtered}
                  className="w-50 ms-4"
                  placeholder='Filter by type...'
                  onChange={(option) => { setFiltered(option); }}
                  options={
                    types.map((item) => ({ value: item, label: item }))
                  }
                />
                <button type="button" className="btn btn-warning" onClick={() => { setFiltered(null); }}>
                  <FontAwesomeIcon icon={faEraser} />
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {centres
            .filter((centre) => filtered === null || centre.type === filtered.value)
            .map((centre) => <CentreCard data={centre} key={centre.id} />)}
        </div>
      </div>
  </div>
  );
};

export default Centres;
