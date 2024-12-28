import testimonials from './data/testimonialsData';
import TestimonialCard from '../components/TestimonialCard';

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Clientes Satisfechos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

