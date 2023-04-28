// Rights required: Admin
// Scope: Lists all the users

import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import axios from 'axios';
import Select from 'react-select';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  // Here we will store the input fields value (in case we change name)
  let newName = '';
  let newRole = '';
  let newStatus = '';

  const columns = [
    { dataField: 'email', text: 'User email' },
    { dataField: 'name', text: 'User name' },
    { dataField: 'role', text: 'User role' },
    { dataField: 'status', text: 'User status' },
  ];

  const getUsers = () => {
    (async () => {
      const result = await axios.get('http://localhost:9090/api/users');
      setUsers(result.data);
    })();
  };

  useEffect(() => { getUsers(); }, []);

  const updateUserName = (email) => {
    (async () => {
      await axios.patch('http://localhost:9090/api/users/name', {
        email,
        name: newName,
      });
      newName = '';
      getUsers(); // refresh table data
    })();
  };

  const updateUserRole = (email) => {
    if (newRole !== '' && (newRole === 'admin' || newRole === 'user')) {
      (async () => {
        await axios.patch('http://localhost:9090/api/users/role', {
          email,
          role: newRole,
        });
        newRole = '';
        getUsers(); // refresh table data
      })();
    }
  };

  const updateUserStatus = (email) => {
    if (newStatus !== '' && (newStatus === 'OK' || newStatus === 'BLOCK')) {
      (async () => {
        await axios.patch('http://localhost:9090/api/users/status', {
          email,
          status: newStatus,
        });
        newStatus = '';
        getUsers(); // refresh table data
      })();
    }
  };

  const deleteUser = (email) => {
    (async () => {
      await axios.delete('http://localhost:9090/api/users', {
        data: { email },
      });
      getUsers(); // refresh table data
    })();
  };

  // To make react-select behave in flex properly
  const styles = {
    container: (base) => ({
      ...base,
      flex: 1,
    }),
  };

  const expandRow = {
    // eslint-disable-next-line react/display-name
    renderer: (row) => (
      <div className="list-group">
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change name</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Type in a new name for this user in the appropiate field.</small>
          </div>
          <div className="input-group align-self-center w-25">
              <input type="text" className="form-control" placeholder="User name"
                         onChange={(e) => { newName = e.target.value; }} />
                  <button className="btn btn-success" type="button" onClick={() => { updateUserName(row.email); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Change role</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Select the option which best fits the user.</small>
          </div>
          <div className="input-group align-self-center w-25">
              <Select
                onChange={(selected) => { newRole = selected.value; }}
                styles={styles}
                options = {[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
              <button className="btn btn-success" type="button" onClick={() => { updateUserRole(row.email); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-danger d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Block / unblock user</h5>
            <p className="mb-1">This action has immediate effect.</p>
            <small className="text-muted">Select the option which best fits the user.</small>
          </div>
          <div className="input-group align-self-center w-25">
              <Select
                onChange={(selected) => { newStatus = selected.value; }}
                styles={styles}
                options = {[
                  { value: 'OK', label: 'Unblocked' },
                  { value: 'BLOCK', label: 'Blocked' },
                ]}
              />
              <button className="btn btn-success" type="button" onClick={() => { updateUserStatus(row.email); }}>Submit</button>
          </div>
        </span>
        <span className="list-group-item list-group-item-action list-group-item-danger d-flex justify-content-between">
          <div className="w-100">
            <h5 className="mb-1">Delete user metadata</h5>
            <p className="mb-1">This action is permanent.</p>
            <small className="text-muted">This will delete the user from the local configured database.</small>
          </div>
          <button type="button" onClick={() => { deleteUser(row.email); }} className="btn btn-danger align-self-center">Delete</button>
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
        keyField='email'
        data={users}
        columns={columns}
        expandRow={ expandRow }
        pagination={paginationFactory({ prePageText: 'Previous', nextPageText: 'Next' })}
      />
    </div>
  );
};

export default AdminUsers;
