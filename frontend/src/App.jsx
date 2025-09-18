import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
// import Features from "./pages/Features";
// import Pricing from "./pages/Pricing";
// import Support from "./pages/Support";
 import SignUp from "./components/SignUp";
 import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />*/}
        <Route path="/get-started" element={<Dashboard />} />
        <Route path="/sign-up" element={<SignUp />} /> 
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
