import { useState } from "react";
import Navbar from "./Navbar";

export default function Dashboard() {
  const [stats] = useState({
    activeTourists: 120,
    safeZones: 35,
    activeIncidents: 4,
    responseTime: "5 mins",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex flex-col text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow p-8 mt-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Active Tourists */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold">Active Tourists</h2>
            <p className="text-3xl font-bold mt-2">{stats.activeTourists}</p>
            <p className="text-sm text-gray-300 mt-2">
              Currently exploring different locations across the region.
            </p>
          </div>

          {/* Safe Zones */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold">Safe Zones</h2>
            <p className="text-3xl font-bold mt-2">{stats.safeZones}</p>
            <p className="text-sm text-gray-300 mt-2">
              Verified safe locations monitored by the system in real time.
            </p>
          </div>

          {/* Active Incidents */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold">Active Incidents</h2>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {stats.activeIncidents}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Ongoing cases requiring quick attention and safety responses.
            </p>
          </div>

          {/* Avg Response Time */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold">Avg Response Time</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {stats.responseTime}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Average time taken by emergency teams to respond to alerts.
            </p>
          </div>
        </div>

        {/* Subsection: Heading, Subheading & Button */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-2">Plan Your Next Trip</h2>
          <p className="text-gray-300 mb-6">
            Create and manage your journeys with real-time safety insights.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold transition">
            + Create Journey
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-700 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
        {/* System Status */}
        <div>
          <h3 className="font-semibold mb-2">System Status</h3>
          <p className="flex items-center justify-center gap-2 text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400"></span>
            All Systems Operational
          </p>
        </div>

        {/* Last Updated */}
        <div>
          <h3 className="font-semibold mb-2">Last Updated</h3>
          <p className="text-gray-300">Just now</p>
        </div>

        {/* Data Refresh Rate */}
        <div>
          <h3 className="font-semibold mb-2">Data Refresh Rate</h3>
          <p className="text-gray-300">Every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
}
