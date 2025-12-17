
import React from 'react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section
            className="bg-cyan-50 min-h-[500px] lg:min-h-[600px] flex flex-col lg:flex-row items-center overflow-hidden relative"
            style={{ backgroundImage: "url('/leaf-pattern.png')" }}
        >
            {/* Background Pattern */}
            <div
                className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-no-repeat bg-cover lg:bg-contain bg-left-bottom opacity-5 z-0"
                style={{ backgroundImage: "url('/leaf-pattern.png')" }}
            ></div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 p-8 lg:p-20 z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-1">
                <h3 className="text-xs lg:text-sm font-bold tracking-[0.2em] uppercase text-gray-500 mb-4 animate-[fadeInUp_0.8s_ease-out_forwards]">
                    Impresiones Mágicas
                </h3>
                <h1 className="text-5xl lg:text-8xl font-serif font-medium text-gray-900 mb-6 lg:mb-8 leading-tight animate-[fadeInUp_0.8s_ease-out_0.1s_forwards] opacity-0">
                    Personaliza<br />
                    <span className="text-blue-600">lo que</span><br />
                    quieras!
                </h1>
                <p className="text-gray-600 mb-8 max-w-md text-lg lg:text-xl animate-[fadeInUp_0.8s_ease-out_0.2s_forwards] opacity-0">
                    Diseños únicos para productos únicos. Tu imaginación es el límite.
                </p>
                <Link
                    href="#"
                    className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 transition-all hover:scale-105 shadow-lg animate-[fadeInUp_0.8s_ease-out_0.3s_forwards] opacity-0"
                >
                    Empezar a Crear
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        ></path>
                    </svg>
                </Link>
            </div>

            {/* Image Composition */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative flex justify-center items-center z-10 order-2 mt-8 lg:mt-0">
                {/* Marble Background Shape */}
                <div
                    className="absolute bottom-0 right-0 w-[90%] h-[90%] lg:w-3/4 lg:h-3/4 bg-cover bg-center rounded-tl-[100px] lg:rounded-tl-[200px] shadow-2xl"
                    style={{ backgroundImage: "url('/marble-table.jpg')" }}
                ></div>

                {/* Taza (Floating Card) */}
                <div className="absolute top-10 lg:top-20 right-10 lg:right-32 w-1/2 lg:w-5/12 transform -rotate-12 hover:-rotate-6 transition-transform duration-500 drop-shadow-2xl">
                    <div className="bg-white p-3 rounded-2xl shadow-lg overflow-hidden">
                        <img
                            src="/taza.png"
                            alt="Taza personalizada"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Camiseta (Floating Card) */}
                <div className="absolute bottom-0 lg:bottom-10 right-1/4 lg:right-20 w-5/12 lg:w-5/12 transform translate-y-10 lg:translate-y-0 hover:scale-105 transition-transform duration-500 drop-shadow-2xl">
                    <div className="bg-white p-3 rounded-2xl shadow-lg overflow-hidden">
                        <img
                            src="/camiseta.png"
                            alt="Camiseta estampa"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
