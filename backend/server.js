import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = 'https://mi-backend-u1pz.onrender.com';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/csrf-token`, {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log('🔑 Token CSRF recibido en frontend:', data.csrfToken);
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Correo enviado con éxito');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Hubo un error al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  };
}