export default function DownloadAppSection() {
    return (
        <div className="relative bg-[#040947] overflow-hidden py-24 px-6">

            {/* 🌌 Background */}
            <div className="absolute inset-0">
                <div className="absolute w-[500px] h-[500px] bg-[#ebbc01] opacity-20 blur-[120px] top-[-100px] right-[-100px] rounded-full"></div>
                <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] bottom-[-100px] left-[-100px] rounded-full"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">

                {/* 📱 LEFT → Screenshots */}
                <div className="relative w-full lg:w-1/2 flex justify-center items-center">

                    {/* Main (Home) */}
                    <img
                        src="/home.png"
                        className="w-[230px] lg:w-[300px] z-30 rounded-2xl shadow-2xl transition duration-500 hover:scale-105 "
                    />

                    {/* Behind 1 (Request) */}
                    <img
                        src="/request.png"
                        className="w-[230px] lg:w-[260px] absolute left-1 top-10 rotate-[-10deg] z-10 opacity-80 rounded-2xl shadow-xl transition duration-500 hover:scale-105"
                    />

                    {/* Behind 2 (Order) */}
                    <img
                        src="/order.png"
                        className="w-[230px] lg:w-[260px] absolute left-60 top-20 rotate-[10deg] z-10 opacity-80 rounded-2xl shadow-xl transition duration-500 hover:scale-105"
                    />

                    {/* Glow under images */}
                    <div className="absolute bottom-[-30px] w-[250px] h-[50px] bg-[#ebbc01] opacity-30 blur-2xl rounded-full"></div>
                </div>

                {/* 🔤 RIGHT → Text */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#ebbc01] leading-tight">
                        Download <br />
                        Mobile App <br />
                        Now
                    </h1>

                    <p className="text-gray-300 mt-6 text-lg max-w-lg mx-auto lg:mx-0">
                        Experience seamless laundry service at your fingertips. Book pickups,
                        track orders, and enjoy hassle-free cleaning anytime, anywhere.
                    </p>

                    {/* Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                        <button className="bg-[#ebbc01] text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
                            Google Play
                        </button>
                        <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
                            App Store
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}