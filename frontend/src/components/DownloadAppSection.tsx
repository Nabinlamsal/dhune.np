export default function DownloadAppSection() {
    return (
        <>
            {/* Download App Section */}
            <div className="relative bg-[#040947] overflow-hidden py-20 px-5">


                <div className="absolute inset-0">

                    <div className="absolute w-[500px] h-[500px] bg-[#ebbc01] opacity-20 blur-[120px] top-[-100px] right-[-100px] rounded-full"></div>
                    <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] bottom-[-100px] left-[-100px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">

                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#ebbc01] leading-tight">
                        Download <br />
                        Mobile Application <br />
                        Now
                    </h1>
                    <p className="text-gray-300 mt-6 text-lg max-w-2xl">
                        Experience seamless laundry service at your fingertips. Book pickups,
                        track orders, and enjoy hassle-free cleaning anytime, anywhere.
                    </p>

                    {/* Buttons */}
                    <div className="mt-10 flex gap-6 flex-wrap justify-center">
                        <button className="bg-[#ebbc01] text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
                            Google Play
                        </button>
                        <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
                            App Store
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}