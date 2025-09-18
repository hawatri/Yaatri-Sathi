import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
 import SignUp from "./components/SignUp";
 import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateJourney from "./components/CreateJourney";
import KYCform from "./components/KYCForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-started" element={<Dashboard />} />
        <Route path="/create-journey" element={<CreateJourney />} />
        <Route path="/sign-up" element={<SignUp />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/KYCForm" element={<KYCform />} />

      </Routes>
    </Router>
  );
}

export default App;
