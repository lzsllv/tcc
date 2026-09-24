import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/AppRoutes.jsx';
import { AppProvider } from './context/AppProvider.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
