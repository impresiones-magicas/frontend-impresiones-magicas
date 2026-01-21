
import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto border-t border-gray-200">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Marca y Descripción */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-serif text-white font-bold mb-4">Impresiones Mágicas</h2>
                        <p className="text-sm leading-relaxed mb-4">
                            Transformamos palabras en arte. Caligrafía artesanal y diseño exclusivo para tus momentos inolvidables.
                        </p>
                        <div className="flex space-x-4">
                            {/* Redes Sociales (Icono Instagram SVG) */}
                            <Link href="https://www.instagram.com/impresionesmagicas_/" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram" target='_blank'>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Enlaces: Catálogo */}
                    <div>
                        <h3 className="text-white font-semibold uppercase tracking-wider mb-4">Catálogo</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Invitaciones de Boda</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Sobres Caligrafiados</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Láminas Personalizadas</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Seating Plans</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Marcasitios</Link></li>
                        </ul>
                    </div>

                    {/* Enlaces: Información */}
                    <div>
                        <h3 className="text-white font-semibold uppercase tracking-wider mb-4">Información</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Envíos y Devoluciones</Link></li>
                            <li><Link href="#" className="hover:text-yellow-400 transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold uppercase tracking-wider mb-4">Newsletter</h3>
                        <p className="text-sm mb-4">Suscríbete para recibir inspiración y ofertas especiales.</p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                            />
                            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded transition-colors text-sm cursor-pointer">
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {currentYear} Impresiones Mágicas. Hecho con amor y tinta.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-gray-300">Política de Privacidad</Link>
                        <Link href="#" className="hover:text-gray-300">Términos de Uso</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
