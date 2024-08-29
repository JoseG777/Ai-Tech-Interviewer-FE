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
import UpdatePassword from "./views/UpdatePassword.jsx";
import DeleteAccount from "./views/DeleteUser.jsx";
import UserHistory from './views/UserHistory.jsx';
import Exam from './views/UserExam.jsx';
import AddLeetCode from './views/AddLeetCode.jsx';
import withAuthAndExamCheck from './HOCs/CheckSignIn.jsx'; 
import withNotSignedInCheck from './HOCs/CheckNotSignedIn.jsx';
import './App.css';

function App() {
  // Wrapping components in proper HOC

  // routes only for users who are signed in
  const ProtectedMain = withAuthAndExamCheck(Main);
  const ProtectedNewUser = withAuthAndExamCheck(NewUser);
  const ProtectedInterview = withAuthAndExamCheck(Interview);
  const ProtectedResources = withAuthAndExamCheck(Resources);
  const ProtectedProfile = withAuthAndExamCheck(Profile);
  const ProtectedUpdateGoal = withAuthAndExamCheck(UpdateGoal);
  const ProtectedUpdateInterview = withAuthAndExamCheck(UpdateInterview);
  const ProtectedAddLeetCode = withAuthAndExamCheck(AddLeetCode);
  const ProtectedUpdatePassword = withAuthAndExamCheck(UpdatePassword);
  const ProtectedDeleteAccount = withAuthAndExamCheck(DeleteAccount);
  const ProtectedUserHistory = withAuthAndExamCheck(UserHistory);
  const ProtectedExam = withAuthAndExamCheck(Exam);

  // routes only for users who are not signed in
  const HomeWithCheck = withNotSignedInCheck(Home);
  const SignUpWithCheck = withNotSignedInCheck(SignUp);
  const SignInWithCheck = withNotSignedInCheck(SignIn);

  return (
    <Router>
      <MainLayout
        ProtectedMain={ProtectedMain}
        ProtectedNewUser={ProtectedNewUser}
        ProtectedInterview={ProtectedInterview}
        ProtectedResources={ProtectedResources}
        ProtectedProfile={ProtectedProfile}
        ProtectedUpdateGoal={ProtectedUpdateGoal}
        ProtectedUpdateInterview={ProtectedUpdateInterview}
        ProtectedAddLeetCode={ProtectedAddLeetCode}
        ProtectedUpdatePassword={ProtectedUpdatePassword}
        ProtectedDeleteAccount={ProtectedDeleteAccount}
        ProtectedUserHistory={ProtectedUserHistory}
        ProtectedExam={ProtectedExam}
        HomeWithCheck={HomeWithCheck}
        SignUpWithCheck={SignUpWithCheck}
        SignInWithCheck={SignInWithCheck}
      />
    </Router>
  );
}

function MainLayout({
  ProtectedMain,
  ProtectedNewUser,
  ProtectedInterview,
  ProtectedResources,
  ProtectedProfile,
  ProtectedUpdateGoal,
  ProtectedUpdateInterview,
  ProtectedAddLeetCode,
  ProtectedUpdatePassword,
  ProtectedDeleteAccount,
  ProtectedUserHistory,
  ProtectedExam,
  HomeWithCheck,
  SignUpWithCheck,
  SignInWithCheck,
}) {
  const location = useLocation();
  const hideNavBarRoutes = ['/', '/signin', '/signup', '/newuser', '/interview', '/exam'];

  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeWithCheck />} />
        <Route path="/signup" element={<SignUpWithCheck />} />
        <Route path="/signin" element={<SignInWithCheck />} />
        <Route path="/main" element={<ProtectedMain />} />
        <Route path="/newuser" element={<ProtectedNewUser />} />
        <Route path="/interview" element={<ProtectedInterview />} />
        <Route path="/add-leetcode" element={<ProtectedAddLeetCode />} />
        <Route path="/resources" element={<ProtectedResources />} />
        <Route path="/profile" element={<ProtectedProfile />} />
        <Route path="/update-password" element={<ProtectedUpdatePassword />} />
        <Route path="/update-current-goal" element={<ProtectedUpdateGoal />} />
        <Route path="/update-upcoming-interview" element={<ProtectedUpdateInterview />} />
        <Route path="/delete-account" element={<ProtectedDeleteAccount />} />
        <Route path="/history" element={<ProtectedUserHistory />} />
        <Route path="/exam" element={<ProtectedExam />} />
      </Routes>
    </>
  );
}

export default App;