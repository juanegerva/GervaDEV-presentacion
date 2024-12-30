// Ícono actualizado para X (Twitter)
import PropTypes from 'prop-types';

const SocialLinks = ({ links }) => {
  return (
    <div className="flex justify-center space-x-6 text-3xl">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="hover:text-blue-400 transform hover:scale-110 transition-all duration-300"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

SocialLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
};

export default SocialLinks;
