<<<<<<< HEAD
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
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> 518cc62ff86c8c3ee68fb50e6ca8cd2370d0029b
