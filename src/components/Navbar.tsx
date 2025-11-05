export default function Navbar() {
  return (
    <nav className="fixed top-0 flex items-center w-full justify-between bg-gradient-to-b from-green-200 to-green-50 md:h-15 h-10 py-4 text-gray-800 font-sans font-semibold px-8">

      <div className="flex items-center space-x-2">
        <img src="/1.png" alt="logo" className="h-8 w-8 mix-blend-multiply" />
        <h6 className="font-semibold">Dhune.np</h6>
      </div>

      <div className="flex flex-grow justify-center">
        <div className="flex items-center space-x-8">
          <a href="#" className="hover:text-green-600 transition">About</a>
          <a href="#" className="hover:text-green-600 transition">Services</a>
          <a href="#" className="hover:text-green-600 transition">FAQs</a>
          <a href="#" className="hover:text-green-600 transition">Contact</a>
          <a href="#" className="hover:text-green-600 transition">Blogs</a>
        </div>
      </div>

      <div>
        <button className="bg-green-700 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition">
          Book Service
        </button>
      </div>

    </nav>
  );
}
