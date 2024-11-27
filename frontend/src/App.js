import MainPage from "./pages/MainPage";
import Footer from "./components/Footer";
import GlobalAlert from './components/GlobalAlert';
import { Provider } from 'react-redux';
import store from './redux/store';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Importa os estilos CSS do AOS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  AOS.init({ once: true });

  return (
    <Provider store={store}>
      <GlobalAlert />
      <MainPage />
      <Footer />
    </Provider>
  );
}

export default App;