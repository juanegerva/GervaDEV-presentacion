import PropTypes from 'prop-types';

// Ruta directa si la imagen está en public/assets/images
const ProjectCard = ({ project }) => {
  const imagePath = project.image ? project.image : '/assets/images/default-image.jpg';

  return (
    <div className="text-center">
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar el proyecto ${project.name}`}
      >
        <img
          src={imagePath}
          alt={project.description || `Vista previa de ${project.name}`}
          className="w-72 h-48 object-cover mx-auto rounded-lg shadow-lg hover:opacity-75 transition-opacity duration-300"
          loading="lazy"
        />
      </a>
      <h3 className="text-lg font-semibold mt-4">{project.name}</h3>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    link: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default ProjectCard;

