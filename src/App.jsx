import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Importa todas as páginas do sistema
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import CustosFixos from './pages/CustosFixos';
import Configuracoes from './pages/Configuracoes';
import Simulacao from './pages/Simulacao';
import Relatorio from './pages/Relatorio';

// Rota protegida — só acessa se estiver logado
function RotaProtegida({ children }) {
  const { usuarioLogado } = useApp();
  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota inicial — Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas — só acessa logado */}
          <Route path="/dashboard" element={
            <RotaProtegida><Dashboard /></RotaProtegida>
          } />
          <Route path="/produtos" element={
            <RotaProtegida><Produtos /></RotaProtegida>
          } />
          <Route path="/custos-fixos" element={
            <RotaProtegida><CustosFixos /></RotaProtegida>
          } />
          <Route path="/configuracoes" element={
            <RotaProtegida><Configuracoes /></RotaProtegida>
          } />
          <Route path="/simulacao" element={
            <RotaProtegida><Simulacao /></RotaProtegida>
          } />
          <Route path="/relatorio" element={
            <RotaProtegida><Relatorio /></RotaProtegida>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
