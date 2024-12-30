import PropTypes from 'prop-types';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img
        src={testimonial.photo}
        alt={`Foto de ${testimonial.name}`}
        className="w-24 h-24 mx-auto rounded-full mb-4"
        loading="lazy"
      />
      <h3 className="text-xl font-semibold mb-2">{testimonial.name}</h3>
      <p className="text-gray-400">{testimonial.feedback}</p>
    </div>
  );
};

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    feedback: PropTypes.string.isRequired,
  }).isRequired,
};

export default TestimonialCard;
