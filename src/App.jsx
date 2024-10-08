import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Main from './views/Main';
import NewUser from './views/NewUser';
import Interview from './views/Interview';
import NavBar from './components/NavBar';
import Resources from './views/Resources';
import Profile from './views/Profile';
import UpdateGoal from "./views/UpdateGoal.jsx";
import UpdateInterview from "./views/UpdateInterview.jsx";
import UpdateLevel from "./views/UpdateLevel.jsx";
import UpdatePassword from "./views/UpdatePassword.jsx";
import DeleteAccount from "./views/DeleteUser.jsx";
import UserHistory from './views/UserHistory.jsx';
import './App.css';


function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideNavBarRoutes = ['/','/signin', '/signup', '/newuser', '/interview'];

  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/main" element={<Main />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/update-current-goal" element={<UpdateGoal />} />
        <Route path="/update-upcoming-interview" element={<UpdateInterview />} />
        <Route path="/update-level-description" element={<UpdateLevel />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/history" element={<UserHistory />} />
      </Routes>
    </>
  );
}

export default App;
