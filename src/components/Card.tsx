
interface WhyUsProps {
    title: string;
    description: string;
    img: string;
}

export default function WhyUs({ title, description, img }: WhyUsProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-green-300 hover:shadow-xl hover:-translate-y-3 transform transition-all duration-300 p-8 flex flex-col items-center text-center hover:border-2 hover:border-red-400">
            <div className="bg-green-200 hover:bg-green-200 transition-colors duration-300 rounded-full p-4 mb-4 flex items-center justify-center">
                <img
                    src={img}
                    alt={title}
                    className="w-12 h-12 mix-blend-normal"
                />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-700 text-base leading-relaxed font-serif">{description}</p>
        </div>
    );
}