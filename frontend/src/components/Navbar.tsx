// Navbar.jsx
"use client";
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 bg-[#F7F5EE] text-[#1A1A2E] font-nunito font-semibold px-8 shadow-md">
      <div className="flex items-center space-x-2 px-10">
        <img src="/image.png" alt="logo" className="h-10 w-10 mix-blend-multiply" /><span>Dhune.np</span>
      </div>

      <div className="hidden md:flex justify-center">
        <div className="flex items-left space-x-8">
          <a
            href="#"
            className="relative text-black hover:text-[#040947] transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-[#ebbc01] hover:before:w-full before:transition-all"
          >About</a>
          <a
            href="#"
            className="relative text-black hover:text-[#040947] transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-[#ebbc01] hover:before:w-full before:transition-all"
          >How it Works?</a>
          <a
            href="#"
            className="relative text-black hover:text-[#040947] transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-[#ebbc01] hover:before:w-full before:transition-all"
          >Services</a>
          <a
            href="#"
            className="relative text-black hover:text-[#040947] transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-[#ebbc01] hover:before:w-full before:transition-all"
          >Help Section</a>
          <a
            href="#"
            className="relative text-black hover:text-[#040947] transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-[#ebbc01] hover:before:w-full before:transition-all"
          >Contact</a>

        </div>
      </div>

      <div>
        <button onClick={() => router.push("/auth/login")} className="text-[#F7F5EE] h-8 px-4 py-1 rounded-lg bg-[#040947] hover:bg-[#121008ea] transition">
          Book Service
        </button>
      </div>
    </nav >
  );
}
