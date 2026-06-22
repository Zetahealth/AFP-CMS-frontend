
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Auth/Login";
// import Signup from "./Auth/Signup";
// import Dashboard from "./pages/Dashboard";


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ScreenView from "./pages/ScreenView";
import Admin from "./pages/Admin";
import PrivateRoute from "./pages/PrivateRoute";
import AdminLayout from "././pages/Admin/AdminLayout"
import ContainerView from "./pages/ContainerView";

import MoreOptionsView from "./pages/MoreOptionsView"
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";

function App() {
  const token = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* Root path: check if logged in */}
        <Route
          path="/"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route  path="/forgot-password"  element={<ForgotPassword />}  />

        <Route  path="/reset-password"  element={<ResetPassword />}  />


        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
        />

        <Route path="/admin/*" element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
        />

        {/* <Route 
          path="/screen/:slug" 
          element={
            <PrivateRoute role="user">
              <ScreenView/>
            </PrivateRoute>
          }
        
        /> */}
        <Route
          path="/screen/:slug"
          element={
            <ScreenView />
          }
        />

        <Route
          path="/container/:slug"
          element={
            <ContainerView />
          }
        />




        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="user">
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }
        />

        <Route
          path="/container/:slug/more"
          element={
            <MoreOptionsView />
          }
        />



        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

