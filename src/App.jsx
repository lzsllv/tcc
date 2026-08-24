import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import LandingPage    from './pages/LandingPage';
import Login         from './pages/Login';
import Cadastro      from './pages/Cadastro';
import Dashboard     from './pages/Dashboard';
import Produtos      from './pages/Produtos';
import Insumos       from './pages/Insumos';
import CustosFixos   from './pages/CustosFixos';
import Configuracoes from './pages/Configuracoes';
import Simulacao     from './pages/Simulacao';
import Relatorio     from './pages/Relatorio';
import NotFound      from './pages/NotFound';

function RotaProtegida({ children }) {
  const { usuarioLogado } = useApp();
  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RaizOuDashboard() {
  const { usuarioLogado } = useApp();
  return usuarioLogado ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<RaizOuDashboard />} />

          {/* Rotas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard"    element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/produtos"     element={<RotaProtegida><Produtos /></RotaProtegida>} />
          <Route path="/insumos"      element={<RotaProtegida><Insumos /></RotaProtegida>} />
          <Route path="/custos-fixos" element={<RotaProtegida><CustosFixos /></RotaProtegida>} />
          <Route path="/configuracoes" element={<RotaProtegida><Configuracoes /></RotaProtegida>} />
          <Route path="/simulacao"    element={<RotaProtegida><Simulacao /></RotaProtegida>} />
          <Route path="/relatorio"    element={<RotaProtegida><Relatorio /></RotaProtegida>} />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
