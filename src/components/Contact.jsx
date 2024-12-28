import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify';
import 'react-toastify/dist/ReactToastify.css';
import Field from './Field';  // Importamos el nuevo componente

// Validaciones regex
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name) => /^[a-zA-ZÀ-ÿ\s]{3,50}$/.test(name);
const validateMessage = (message) => message.length >= 10;
const validatePhone = (phone) => /^[0-9\s+]{7,15}$/.test(phone) || phone === '';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
  });
  const [csrfToken, setCsrfToken] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Obtener el token CSRF
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/csrf-token', {
          method: 'GET',
          credentials: 'include',  // IMPORTANTE para enviar cookies
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);  // Guardar token
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);
  

  // Validar campos
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value)
          ? ''
          : 'El nombre debe tener entre 3 y 50 caracteres y solo letras.';
      case 'email':
        return validateEmail(value) ? '' : 'Introduce un email válido.';
      case 'phone':
        return validatePhone(value)
          ? ''
          : 'El teléfono debe contener solo números (7-15 dígitos).';
      case 'message':
        return validateMessage(value)
          ? ''
          : 'El mensaje debe tener al menos 10 caracteres.';
      case 'honeypot':
        return value ? 'Acción bloqueada por seguridad.' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [name]: sanitizedValue });

    if (touched[name]) {
      const errorMessage = validateField(name, sanitizedValue);
      setErrors({ ...errors, [name]: errorMessage });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, completa los campos correctamente.');
      return;
    }

    if (formData.honeypot) {
      toast.error('Acción bloqueada por seguridad.');
      return;
    }

    setIsLoading(true);  // Inicia animación de carga

    try {
      const response = await fetch('http://localhost:5000/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,  // Enviar el token CSRF
        },
        credentials: 'include',  // Importante para enviar cookies
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        toast.success('¡Correo enviado con éxito!',  {
          position: 'top-center',  // Centrar la notificación
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          
         
      draggable: true,
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Hubo un problema al enviar el correo.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar el correo.', {
        position: 'top-center',  // También centrado para errores
        autoClose: 2000,
      });
    }finally {
      setIsLoading(false);  // Restablece el botón siempre
    }
  };

  return (
    <section id="contact" className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-20">
      <motion.div
        className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Contáctame</h1>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot || ''}
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          {/** Campo Nombre */}
          <Field
            id="name"
            label="Nombre"
            error={errors.name}
            value={formData.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          {/** Campo Email */}
          <Field
            id="email"
            label="Email"
            error={errors.email}
            value={formData.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

          {/** Campo Teléfono (Opcional) */}
          <Field
            id="phone"
            label="Teléfono (opcional)"
            error={errors.phone}
            value={formData.phone || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/** Campo Mensaje */}
          <Field
            id="message"
            label="Mensaje"
            error={errors.message}
            value={formData.message || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            textarea
            required
          />

          <motion.button
            type="submit"
            className="w-full bg-blue-500 py-2 px-4 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer />
    </section>
  );
};

export default Contact;

