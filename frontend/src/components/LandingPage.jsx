import backgroundImage from "../assets/bgimage.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-fixed relative flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-10 py-5
                   bg-black/30 backdrop-blur-md rounded-xl">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/compass.png"
            alt="SafeTrek Logo"
            className="h-8 w-8"
          />
          <span className="text-white text-xl font-bold">SafeTrek</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/features" className="text-white hover:text-gray-300">
            Features
          </Link>
          <Link to="/emergency" className="text-white hover:text-gray-300">
            Emergency
          </Link>
          <Link to="/support" className="text-white hover:text-gray-300">
            Support
          </Link>
          <Link
              to="/sign-up"
              className="ml-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow text-white px-6">
        <h1 className="text-5xl font-bold mb-4">Your Safety , Our Priority</h1>
        <p className="text-lg mb-6 max-w-xl">
          SafeTrek is a smart safety monitoring and incident response system
          designed to keep you safe while exploring new places. With real-time
          alerts and quick access to emergency services, SafeTrek ensures you
          can enjoy your adventures with peace of mind.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}