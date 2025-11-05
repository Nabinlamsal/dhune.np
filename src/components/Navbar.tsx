// Navbar.jsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 bg-[#F7F5EE] text-[#1A1A2E] font-sans font-semibold px-8 shadow-md">
      <div className="flex items-center space-x-2 px-10">
        <img src="/image.png" alt="logo" className="h-10 w-10 mix-blend-multiply" /><span>Dhune.np</span>
      </div>

      <div className="hidden md:flex justify-center">
        <div className="flex items-left space-x-8">
          <a href="#" className="hover:text-blue-600 transition">About</a>
          <a href="#" className="hover:text-blue-600 transition">Services</a>
          <a href="#" className="hover:text-blue-600 transition">FAQs</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
          <a href="#" className="hover:text-blue-600 transition">Blogs</a>
        </div>
      </div>

      <div>
        <button className="bg-[] text-[#F7F5EE]  px-4 py-1 rounded-lg bg-blue-600 hover:bg-[#121008ea] transition">
          Book Service
        </button>
      </div>
    </nav>
  );
}
