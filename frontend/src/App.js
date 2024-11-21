import MainPage from "./pages/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import GlobalAlert from './components/GlobalAlert';

function App() {
  return (
    <Provider store={store}>
      <GlobalAlert />
      <MainPage />
    </Provider>
  );
}

export default App;