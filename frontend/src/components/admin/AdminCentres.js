// Rights required: Admin
// Scope: Lists all the centres

import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminCentres = () => {
  const [centres, setCentres] = useState([]);
  const [file, setFile] = useState(null);

  let newName = '';
  let newType = '';
  let newLocation = '';
  let newPrice = 0;
  let newDescription = '';

  const columns = [
    { dataField: 'id', text: 'Centre id' },
    { dataField: 'name', text: 'Centre name' },
    { dataField: 'type', text: 'Centre type' },
    { dataField: 'location', text: 'Centre location' },
    { dataField: 'price', text: 'Centre price' },
    { dataField: 'description', text: 'Centre description' },
  ];

  const getCentres = () => {
    (async () => {
      const result = await axios.get('http://localhost:9090/api/centres');
      setCentres(result.data);
    })();
  };

  useEffect(() => { getCentres(); }, []);

  const updateCentreName = (id) => {
    (async () => {
      await axios.patch('http://localhost:9090/api/centres/name', {
        id,
        name: newName,
      });
      newName = '';
      getCentres(); // refresh table data
    })();
  };

  const updateCentreType = (id) => {
    (async () => {
      await axios.patch('http://localhost:9090/api/centres/type', {
        id,
        type: newType,
      });
      newType = '';
      getCentres(); // refresh table data
    })();
  };

  const updateCentreLocation = (id) => {
    (async () => {
      await axios.patch('http://localhost:9090/api/centres/location', {
        id,
        location: newLocation,
      });
      newLocation = '';
      getCentres(); // refresh table data
    })();
  };

  const updateCentrePrice = (id) => {
    (async () => {
      await axios.patch('http://localhost:9090/api/centres/price', {
        id,
        price: newPrice,
      });
      newPrice = 0;
      getCentres(); // refresh table data
    })();
  };

  const updateCentreDescription = (id) => {
    (async () => {
      await axios.patch('http://localhost:9090/api/centres/description', {
        id,
        description: newDescription,
      });
      newDescription = '';
      getCentres(); // refresh table data
    })();
  };

  const updateCentreImage = (id) => {
    const formData = new FormData();
    formData.append('file', file);

    (async () => {
      await axios.patch(`http://localhost:9090/api/centres/${id}/image`, formData);
    })();
  };

  const deleteCentre = (id) => {
    (async () => {
      await axios.delete('http://localhost:9090/api/centres', {
        data: { id },
      });
      getCentres(); // refresh table data
    })();
  };

  const expandRow = {
    // eslint-disable-next-line react/display-name
    renderer: (row) => (
      <div className="list-group">
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change name</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Type in a new text for this centre&lsquo;s name in the appropriate field.</small>
          </div>
          <div className="input-group align-self-center w-50">
              <input type="text" className="form-control" placeholder="Centre name"
                     onChange={(e) => { newName = e.target.value; }}/>
              <button className="btn btn-success" type="button" onClick={() => { updateCentreName(row.id); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change type</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Type in a new text for this centre&lsquo;s type in the appropriate field.</small>
          </div>
          <div className="input-group align-self-center w-50">
              <input type="text" className="form-control" placeholder="Centre type"
                onChange={(e) => { newType = e.target.value; }}/>
              <button className="btn btn-success" type="button" onClick={() => { updateCentreType(row.id); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change location</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Type in a new text for this centre&lsquo;s location in the appropriate field.</small>
          </div>
          <div className="input-group align-self-center w-50">
            <input type="text" className="form-control" placeholder="Centre location"
              onChange={(e) => { newLocation = e.target.value; }}/>
              <button className="btn btn-success" type="button" onClick={() => { updateCentreLocation(row.id); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change price</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Type in a new text for this centre&lsquo;s price in the appropriate field.</small>
          </div>
          <div className="input-group align-self-center w-50">
            <input type="number" className="form-control" placeholder="Centre price" min="0"
             onChange={(e) => { newPrice = e.target.value; }}/>
                  <button className="btn btn-success" type="button" onClick={() => { updateCentrePrice(row.id); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change description</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Type in a new text for this centre&lsquo;s description in the appropriate field.</small>
          </div>
          <div className="input-group align-self-center w-50">
              <textarea id="description" className="form-control" rows="3"
                onChange={(e) => { newDescription = e.target.value; }} />
                  <button className="btn btn-success" type="button" onClick={() => { updateCentreDescription(row.id); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change image</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Select the image you would like to upload to represent the centre.</small>
          </div>
          <div className="input-group align-self-center w-50">
            <input type="file" className="form-control" onChange={(e) => { setFile(e.target.files[0]); }} />
            <button type="submit" className="btn btn-success" onClick={() => { updateCentreImage(row.id); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-danger d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Delete centre</h5>
            <p className="mb-1">This action is permanent.</p>
            <small className="text-muted">This will delete all the bookings which were made to this centre.</small>
          </div>
          <button type="button" onClick={() => { deleteCentre(row.id); }} className="btn btn-danger align-self-center">Delete</button>
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
        <Link to="/admin/add_centre">
          <button className="btn btn-outline-success" type="button">Add a new centre</button>
        </Link>
      </div>
      <div className="row">
        <BootstrapTable
          striped
          hover
          keyField='id'
          data={centres}
          columns={columns}
          expandRow={ expandRow }
          pagination={paginationFactory({ prePageText: 'Previous', nextPageText: 'Next' })}
        />
      </div>
    </>
  );
};

export default AdminCentres;
