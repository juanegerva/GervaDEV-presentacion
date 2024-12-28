import PropTypes from 'prop-types';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div
      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:rotate-1"
      role="article"
      aria-labelledby={title}
    >
      {/* Contenedor centrado para el ícono */}
      <div className="flex justify-center items-center mb-4 h-24">
        <div className="text-7xl text-blue-500">{icon}</div>
      </div>

      <h3 id={title} className="text-2xl font-semibold mb-2">
        {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

ServiceCard.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ServiceCard;
