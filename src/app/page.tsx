// Home.jsx
export default function Home() {
  return (
    <div>
      <div className="relative mt-10 h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat px-10">
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-[#eaeaea] opacity-20"></div>

        {/* Hero content */}
        <div className="relative z-10 flex items-center h-full px-10">
          <div className="w-4/7">
            <p className="font-bold text-[#ebbc01] font-nunito text-base mb-5 sm:text-lg lg:text-xl max-w-md">
              / Connect. Compare. Clean.
            </p>
            <h1 className="text-4xl font-bold text-black sm:text-4xl lg:text-6xl">
              Pickup to Delivery,
              <div className="relative inline-flex">
                <span className="absolute inset-x-0 bottom-0 border-b-[15px] border-blue-600"></span>
                <h1 className="relative text-2xl font-bold text-black sm:text-4xl lg:text-6xl mt-4">Your Way!</h1>
              </div>
            </h1>
            <p className="mt-8 text-xl font-bold text-black mb-8 sm:text-md">"Nepal’s First Platform Connecting You to Multiple Laundry Providers. Dhune.np is for costumers, vendors and business solving the traditional problems."</p>
            <div>

            </div>
            <a href="#" title="" className="inline-flex items-center justify-center px-10 py-4  mr-10 text-base font-semibold text-white transition-all duration-200 bg-[#040947] hover:bg-[#121008ea] rounded-lg" role="button"> Get Started </a>
            <a href="#" title="" className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white transition-all duration-200 bg-[#ebbc01] hover:bg-[#121008ea] rounded-lg" role="button"> Vendor Registration </a>

          </div>
        </div>
      </div>
      <div className="h-50 bg-blue-600 w-full text-white">
        <h1>Second div</h1>

      </div>
    </div>

  );
}
