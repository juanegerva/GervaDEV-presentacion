import { motion } from 'framer-motion';
import IconSet from './IconSet';

const Home = () => {
  return (
    <section id="home" className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-5xl font-bold mb-4">
          Hola, Soy <span className="text-blue-400">Juan</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Desarrollo soluciones con <span className="text-blue-400">React</span>,{' '}
          <span className="text-yellow-400">JavaScript</span> y <span className="text-green-400">Python</span>.
        </p>
        
        {/* Iconos con animación */}
        <IconSet />

        <motion.a
          href="#contact"
          className="px-6 py-3 bg-blue-500 rounded-full text-lg font-semibold hover:bg-blue-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Contáctame
        </motion.a>
      </motion.div>
    </section>
  );
};

// Variantes de animación para framer-motion
const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

export default Home;
