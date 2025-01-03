const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestMail() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'juangervat@gmail.com',  // Usa un correo temporal para probar si no tienes EMAIL_TO
      subject: 'Test de correo nodemailer',
      text: 'Este es un correo de prueba desde el script.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📩 Correo enviado con éxito:', info.response);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
  }
}

sendTestMail();


const BACKEND_URL = 'https://mi-backend-u1pz.onrender.com';

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
        
        if (data.csrfToken) {
          localStorage.setItem('csrfToken', data.csrfToken);  // Guardar en localStorage
          setCsrfToken(data.csrfToken);  // Guardar en estado
          console.log('🔑 Token CSRF recibido y guardado:', data.csrfToken);
        } else {
          console.error('⚠️ No se recibió token CSRF válido');
        }
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
   
    if (!validateForm()) return;

    setLoading(true);
    
    // Tomar el token desde el estado primero, como fallback de localStorage
    const csrfToke = csrfToken || localStorage.getItem('csrfToken');
    console.log("🔑 Token CSRF antes del POST:", csrfToke);

    if (!csrfToke) {
      toast.error('Error: Token CSRF no encontrado.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToke,  // Se envía el token almacenado
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();
      console.log("RESPUESTA DEL SERVIDOR", data);

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
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        placeholder="Nombre" 
        required 
      />
      <input 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        placeholder="Correo electrónico" 
        required 
      />
      <textarea 
        name="message" 
        value={formData.message} 
        onChange={handleChange} 
        placeholder="Mensaje" 
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};
