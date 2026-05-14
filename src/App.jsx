import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import LandingPage    from './pages/LandingPage';
import Login         from './pages/Login';
import Cadastro      from './pages/Cadastro';
import Dashboard     from './pages/Dashboard';
import Produtos      from './pages/Produtos';
import CustosFixos   from './pages/CustosFixos';
import Configuracoes from './pages/Configuracoes';
import Simulacao     from './pages/Simulacao';
import Relatorio     from './pages/Relatorio';
import NotFound      from './pages/NotFound';

function RotaProtegida({ children }) {
  const { usuarioLogado } = useApp();
  if (!usuarioLogado) return <Navigate to="/login" replace />;
  return children;
}

function RotaPublica({ children }) {
  const { usuarioLogado } = useApp();
  if (usuarioLogado) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login"   element={<RotaPublica><Login /></RotaPublica>} />
          <Route path="/cadastro" element={<RotaPublica><Cadastro /></RotaPublica>} />

          <Route path="/dashboard"    element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/produtos"     element={<RotaProtegida><Produtos /></RotaProtegida>} />
          <Route path="/custos-fixos" element={<RotaProtegida><CustosFixos /></RotaProtegida>} />
          <Route path="/configuracoes" element={<RotaProtegida><Configuracoes /></RotaProtegida>} />
          <Route path="/simulacao"    element={<RotaProtegida><Simulacao /></RotaProtegida>} />
          <Route path="/relatorio"    element={<RotaProtegida><Relatorio /></RotaProtegida>} />

          <Route path="/404" element={<NotFound />} />
          <Route path="*"    element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
