import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  return (
    <nav className="bg-black/50 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center shadow-lg">
      {/* Left: Dashboard Title */}
      <h1 className="text-2xl font-extrabold">Dashboard</h1>

      {/* Right: Navigation Links */}
      <div className="flex gap-8 text-lg font-medium px-4 ">
        <button className="hover:text-blue-400 transition">Journeys</button>
        <button className="hover:text-blue-400 transition">Incidents</button>
        <button className="hover:text-blue-400 transition">Reports</button>
        <button className="hover:text-blue-400 transition">Settings</button>
        <ProfileDropdown/>
      </div>
    </nav>
  );
};

export default Navbar;
