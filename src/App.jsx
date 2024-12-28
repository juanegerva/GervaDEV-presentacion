import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import Services from './components/Services';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import Portfolio from './components/Portfolio';

function App() {

  return (
    <>
    <Navbar />
    <Home/>
    <Services/>
    <Portfolio/>
    <Testimonials/>
    <Contact />
    <Footer />  
    </>
  )
}

export default App
