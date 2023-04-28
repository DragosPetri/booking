import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import LoginRequiredRouter from './components/LoginRequiredRouter';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeJumbotron from './components/WelcomeJumbotron';
import Centres from './components/Centres';
import Book from './components/Book';
import UserDashboard from './components/user/UserDashboard';
import AdminAddCentre from './components/admin/AdminAddCentre';
import CentreExtended from './components/CentreExtended';
import AdminDashboard from './components/admin/AdminDashboard';
import Status404 from './components/Status404';

function App() {
  const { isLoading } = useAuth0();

  // Life saver
  if (isLoading) {
    return <></>;
  }

  return (
    <BrowserRouter>
      <Header />
      <WelcomeJumbotron />
        <main>
          <Switch>
            <Route exact path="/" component={Centres} />
            <Route path="/centres/:id" component={CentreExtended} />
            <LoginRequiredRouter exact path="/book" component={Book} />
            <LoginRequiredRouter exact path="/admin/add_centre" component={AdminAddCentre} />
            <LoginRequiredRouter exact path="/user/dashboard" component={UserDashboard} />
            <LoginRequiredRouter exact path="/admin/dashboard" component={AdminDashboard} />

            <Route component={Status404} />
          </Switch>
        </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
