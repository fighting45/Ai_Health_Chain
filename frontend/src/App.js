import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AppDashboard from "./pages/AppDashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<AppDashboard />} />
            <Route path="/app/patients" element={<Patients />} />
            <Route path="/app/doctors" element={<Doctors />} />
            <Route path="/app/appointments" element={<Appointments />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
