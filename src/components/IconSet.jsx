import { motion } from 'framer-motion';
import { FaReact, FaPython, FaJs } from 'react-icons/fa';

// Animaciones de íconos
const iconVariants = {
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};

const IconSet = () => {
  return (
    <div className="flex justify-center space-x-6 text-5xl mb-8">
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={iconVariants}
        aria-label="React"
      >
        <FaReact className="text-blue-400" />
      </motion.div>

      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={iconVariants}
        aria-label="JavaScript"
      >
        <FaJs className="text-yellow-400" />
      </motion.div>

      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={iconVariants}
        aria-label="Python"
      >
        <FaPython className="text-green-400" />
      </motion.div>
    </div>
  );
};

export default IconSet;
