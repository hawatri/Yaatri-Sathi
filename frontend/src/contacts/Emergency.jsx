import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Ambulance,
  Shield,
  Loader2,
  UserPlus,
} from "lucide-react";

export default function EmergencyPage() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Emergency Contacts
  const contacts = [
    { name: "Mom", phone: "+91-9876543210" },
    { name: "Friend", phone: "+91-9123456789" },
  ];

  // Get user location (mock / real via navigator.geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude.toFixed(4),
            long: pos.coords.longitude.toFixed(4),
          });
          setLoading(false);
        },
        () => {
          setLocation({ lat: "22.5726", long: "88.3639" }); // default (Kolkata)
          setLoading(false);
        }
      );
    }
  }, []);

  const handleSOS = () => {
    alert("🚨 SOS Sent! Authorities & contacts notified.");
    // Here you can call your backend API: axios.post("/api/sos", {location, userId})
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold my-6">🚨 Emergency Help Center</h1>
      <p className="text-gray-300 mb-8 text-center max-w-xl">
        In case of emergency, press the SOS button or choose a specific help
        option. Your location will be shared with authorities and trusted
        contacts.
      </p>

      {/* Big SOS Button */}
      <button
        onClick={handleSOS}
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-3xl px-16 py-8 rounded-full shadow-2xl mb-10 animate-pulse"
      >
        SEND SOS
      </button>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
        <button className="bg-gray-800 p-6 rounded-xl flex flex-col items-center hover:bg-gray-700 transition">
          <Ambulance className="w-10 h-10 mb-2 text-green-400" />
          Medical
        </button>
        <button className="bg-gray-800 p-6 rounded-xl flex flex-col items-center hover:bg-gray-700 transition">
          <Shield className="w-10 h-10 mb-2 text-blue-400" />
          Police
        </button>
        <button className="bg-gray-800 p-6 rounded-xl flex flex-col items-center hover:bg-gray-700 transition">
          <AlertTriangle className="w-10 h-10 mb-2 text-yellow-400" />
          Fire
        </button>
        <button className="bg-gray-800 p-6 rounded-xl flex flex-col items-center hover:bg-gray-700 transition">
          <MapPin className="w-10 h-10 mb-2 text-pink-400" />
          Share Location
        </button>
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Location */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-pink-400" /> Current Location
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Fetching location...
            </div>
          ) : (
            <p className="text-gray-300">
              Lat: {location.lat}, Long: {location.long}
            </p>
          )}
        </div>

        {/* Nearest Help */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🏥 Nearest Help Centers</h2>
          <ul className="text-gray-300 space-y-2">
            <li>✅ Hospital – 2 km</li>
            <li>✅ Police Station – 1.5 km</li>
            <li>✅ Fire Station – 3 km</li>
          </ul>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-6 h-6 text-red-400" /> Emergency Contacts
          </h2>
          {contacts.map((c, i) => (
            <button
              key={i}
              className="flex items-center justify-between bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg mb-3 w-full"
            >
              <span>{c.name}</span>
              <span>{c.phone}</span>
            </button>
          ))}
          <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mt-2">
            <UserPlus className="w-5 h-5" /> Add New Contact
          </button>
        </div>
      </div>
    </div>
  );
}
