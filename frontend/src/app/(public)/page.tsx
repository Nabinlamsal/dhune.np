"use client";
import AudienceSection from "../../components/AudienceSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-[#F7F5EE] font-nunito">
      <div className="relative mt-10 h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat px-10">
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-[#eaeaea] opacity-20"></div>

        {/* Hero content */}
        <div className="relative z-10 flex items-center h-full px-10">
          <div className="w-4/7">
            <p className="font-bold text-[#ebbc01] font-nunito text-base mb-5 sm:text-lg lg:text-xl max-w-md">
              / Connect. Compare. Clean.
            </p>
            <h1 className="text-4xl font-bold text-black sm:text-4xl lg:text-6xl font-nunito">
              Pickup to Delivery,
              <div className="relative inline-flex">
                <span className="absolute inset-x-0 bottom-0 border-b-[25px] border-[#ebbc01]"></span>                <h1 className="relative text-2xl font-bold text-black sm:text-4xl lg:text-6xl mt-4">
                  Your Way!
                </h1>
              </div>
            </h1>

            <p className="mt-8 text-xl font-semibold text-neutral-700 mb-8 sm:text-md">
              "Nepal’s First Platform Connecting You to Multiple Laundry Providers. Dhune.np is for costumers, vendors and business solving the traditional problems."
            </p>

            <a
              onClick={() => router.push("/auth/login")}
              className="inline-flex items-center justify-center px-10 py-4 mr-10 text-sm font-semibold text-white transition-all duration-200 bg-[#040947] hover:bg-[#121008ea] rounded-lg h-10"
              role="button"
            >
              Get Started
            </a>
            <a
              onClick={() => router.push("/auth/signup/vendor")}
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-semibold text-black transition-all duration-200 bg-[#ebbc01] hover:bg-[#121008ea] hover:text-white h-10 rounded-lg"
              role="button"
            >
              Vendor Registration
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="flex w-full">
        <div className="w-2/5 flex justify-center items-center p-10">
          <img
            src="/about.jpg"
            className="max-w-full h-auto shadow-2xl shadow-[#ebbc01] rounded-md"
            alt=""
          />
        </div>
        <div className="w-3/5 flex flex-col  p-20">
          <div className="max-w-xl">
            <p className="font-bold text-blue-900 font-nunito text-base mb-5 sm:text-lg lg:text-xl max-w-md">
              /About Us
            </p>
            <h1 className="relative text-4xl font-bold text-black sm:text-5xl">
              Let Your Clothes Shine, Every Time!
              <span className="absolute -bottom-4 left-0 w-1/4 border-b-[10px] border-[#ebbc01]"></span>
            </h1>

            <p className="mt-8 text-md font-light text-neutral-800sm:text-md">
              Dhune.np is Nepal’s first platform connecting customers to multiple laundry providers. We make laundry simple, fast, and reliable. Whether it’s your daily clothes, formal wear, or delicate fabrics, we ensure they are cleaned to perfection and delivered to your doorstep — hassle-free! </p>
            <p className="mt-2 text-md font-semibold italic text-neutral-600 mb-8 sm:text-md">
              "<span className="text-[#040947] font-bold ">Our Mission </span>
              is to simplify how Nepal does laundry by creating a digital ecosystem where quality, trust, and convenience come together"
            </p>

            <AudienceSection />
          </div>

        </div>
      </div>
      <div className="bg-[#040947] justify-center h-100">
        <h1 className="text-6xl align-left self-center font-bold text-amber-400 mt-10"> Download<br />Mobile <br />Application <br />Now</h1>
      </div>
    </div >
  );
}
