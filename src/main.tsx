import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import App from './App';
import { store } from "./store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter basename={`${import.meta.env.BASE_URL}`}>
      <App />
    </BrowserRouter>
  </Provider>
);