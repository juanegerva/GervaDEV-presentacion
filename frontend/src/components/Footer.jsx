import SocialLinks from './SocialLinks';
import { FaGithub, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';  // Nuevo ícono de X

const Footer = () => {
  const socialLinks = [
    {
      url: 'https://github.com/juanegerva',
      label: 'Visitar mi GitHub',
      icon: <FaGithub />,
    },
    {
      url: 'https://twitter.com/JuaneGerva',
      label: 'Visitar mi perfil de X (Twitter)',
      icon: <FaXTwitter />,
    },
    {
      url: 'https://api.whatsapp.com/send?phone=5491159023267&text=Hola%20!%20como%20estas%3F%20en%20que%20te%20puedo%20ayudar%3F',
      label: 'Enviar mensaje a WhatsApp',
      icon: <FaWhatsapp />,
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <a
            href="/"
            className="text-2xl font-bold text-blue-500"
            aria-label="Volver a la página principal"
          >
            Portafolio
          </a>
        </div>

        {/* Íconos de Redes Sociales */}
        <SocialLinks links={socialLinks} />

        {/* Copyright */}
        <p className="text-gray-400 mt-8 text-sm">
          &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
