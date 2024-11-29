import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home";
import CreateEvent from "./pages/Dashboard/CreateEvent";
import UpdateEvent from "./pages/Dashboard/UpdateEvent";
import ParticipantListe from "./pages/Dashboard/ParticipantListe";
import CreateParticipant from "./pages/Dashboard/CreateParticipant";
import UpdateParticipant from "./pages/Dashboard/UpdateParticipant";

// route privet
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/updateEvent/:id"
          element={
            <PrivateRoute>
              <UpdateEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/participantListe/:eventId"
          element={
            <PrivateRoute>
              <ParticipantListe />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-participant/:eventId"
          element={
            <PrivateRoute>
              <CreateParticipant />
            </PrivateRoute>
          }
        />

        <Route
          path="/updateParticipant/:participantId"
          element={
            <PrivateRoute>
              <UpdateParticipant />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
