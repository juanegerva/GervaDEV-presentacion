import { useState, useEffect, useRef } from 'react';
import NavbarItem from './NavbarItem';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);  // Referencia para detectar clic fuera del menú

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      // Cierra el menú si se hace clic fuera del contenedor
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Función para cerrar el menú al seleccionar una opción
  const closeMenuOnClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-white">
          GERVA DEV
        </a>

        {/* Enlaces visibles en escritorio */}
        <div className="hidden md:flex space-x-8">
          <NavbarItem to="#home" label="Home" />
          <NavbarItem to="#services" label="Servicios" />
          <NavbarItem to="#portfolio" label="Portafolio" />
          <NavbarItem to="#contact" label="Contacto" />
        </div>

        {/* Menú hamburguesa para móviles */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} aria-label="Abrir menú">
            {menuOpen ? (
              <FaTimes className="text-white text-3xl" />
            ) : (
              <FaBars className="text-white text-3xl" />
            )}
          </button>
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -20 }}
        className={`absolute bg-gray-800 top-16 left-0 w-full flex flex-col items-center ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <NavbarItem to="#home" label="Home" mobile onClick={closeMenuOnClick} />
        <NavbarItem to="#services" label="Servicios" mobile onClick={closeMenuOnClick} />
        <NavbarItem to="#portfolio" label="Portafolio" mobile onClick={closeMenuOnClick} />
        <NavbarItem to="#contact" label="Contacto" mobile onClick={closeMenuOnClick} />
      </motion.div>
    </nav>
  );
};

export default Navbar;
