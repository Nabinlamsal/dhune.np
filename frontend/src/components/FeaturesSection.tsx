export default function FeaturesSection() {
    return (
        <div className="bg-[#F7F5EE] mx-5 my-10 px-6">
            <p className="text-[#040947] font-bold text-lg mb-5">
                / Why Dhune?
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#040947] text-white mb-4 group-hover:scale-110 transition">
                        🧺
                    </div>
                    <h3 className="text-xl font-semibold text-[#040947] mb-2">
                        Multiple Vendors
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Access a wide network of trusted laundry providers near you.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ebbc01] text-black mb-4 group-hover:scale-110 transition">
                        💰
                    </div>
                    <h3 className="text-xl font-semibold text-[#040947] mb-2">
                        Compare Prices
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Vendors bid on your request — you choose the best offer.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#040947] text-white mb-4 group-hover:scale-110 transition">
                        🚚
                    </div>
                    <h3 className="text-xl font-semibold text-[#040947] mb-2">
                        Pickup & Delivery
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Schedule pickups and get your clothes delivered to your doorstep.
                    </p>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ebbc01] text-black mb-4 group-hover:scale-110 transition">
                        📊
                    </div>
                    <h3 className="text-xl font-semibold text-[#040947] mb-2">
                        Track Orders
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Stay updated with real-time status of your laundry orders.
                    </p>
                </div>

            </div>
        </div>
    );
}