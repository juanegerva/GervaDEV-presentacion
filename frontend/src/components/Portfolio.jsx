import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import projects from './data/projectsData';
import ProjectCard from './ProjectCard';

const Portfolio = () => {
  return (
    <section id="portfolio" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl font-bold text-center mb-12">Portafolio</h2>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          spaceBetween={30}
          slidesPerView={3}  // Valor por defecto para pantallas grandes
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },  // Móviles
            640: { slidesPerView: 2, spaceBetween: 20 },  // Tablets
            1024: { slidesPerView: 3, spaceBetween: 30 },  // Escritorio
          }}
          aria-live="polite"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={index}>
              <ProjectCard project={project} />
              <p className="text-gray-400 mt-4 text-center">{project.description}</p>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Flechas personalizadas */}
        <div className="swiper-button-prev custom-arrow-left"></div>
        <div className="swiper-button-next custom-arrow-right"></div>

        {/* Paginación personalizada */}
        <div className="custom-pagination mt-8 flex justify-center"></div>
      </div>
    </section>
  );
};

export default Portfolio;
