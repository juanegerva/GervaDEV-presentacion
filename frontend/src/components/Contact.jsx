import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// URL del backend (Render)
const BACKEND_URL = 'https://mi-backend-u1pz.onrender.com'; // No localhost:5000


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);



  // Obtener CSRF Token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      console.log("🔑 entre aca al fetch");
      try {
        const response = await fetch(`${BACKEND_URL}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log('🔑 Token CSRF recibido:', data.csrfToken);
      } catch (error) {
        console.error('❌ Error al obtener el token CSRF:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      toast.error('Todos los campos obligatorios deben ser completados.');
      return false;
    }
    return true;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = localStorage.getItem('csrfToken')
    if (!validateForm()) return;

    setLoading(true);
    console.log("entre al POST")
    try {
      const response = await fetch(`${BACKEND_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();
    

      if (response.ok) {
        toast.success('¡Correo enviado con éxito!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(data.error || 'Error al enviar el formulario.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-16"
    >
      <motion.div
        className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg mb-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Contáctame</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-400 font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            />
          </div>

          {/* Campo Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            />
          </div>

          {/* Campo Teléfono */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-400 font-semibold mb-2">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            />
          </div>

          {/* Campo Mensaje */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-400 font-semibold mb-2">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            ></textarea>
          </div>

          {/* Botón de Enviar */}
          <motion.button
            type="submit"
            className="w-full bg-blue-500 py-2 px-4 rounded-lg font-semibold text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer position="top-center" autoClose={3000} />
    </section>
  );
};

export default Contact;
