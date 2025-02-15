import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../route/Home';
import NotFound from '../route/NotFound';
import Booking from '../route/PatientBook';
import Loading from '../route/Loading';
import IsLogSignIn from '../route/Login_SignIn';
import Profile from '../route/User/Profile';
import { Landing } from './Landing';
//hook for checking who tf is logging in

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="loading" element={<Loading />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<Home />}>
            <Route path="/home" element={<Landing />} />
            <Route path="/user/profile" element={<Profile />} />
          </Route>
          <Route path="/login-signin" element={<IsLogSignIn />} />
          {/* <Route path="/login" element={<IsLoggedIn />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Router>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isDoctor: state.isDoctor,
    isPatient: state.isPatient,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
