import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import Cadastro from '../pages/Cadastro';
import CanaisVenda from '../pages/CanaisVenda';
import Configuracoes from '../pages/Configuracoes';
import CustosFixos from '../pages/CustosFixos';
import Dashboard from '../pages/Dashboard';
import FichaTecnica from '../pages/FichaTecnica';
import Insumos from '../pages/Insumos';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Produtos from '../pages/Produtos';
import Relatorio from '../pages/Relatorio';
import Simulacao from '../pages/Simulacao';

function ProtectedRoute({ children }) {
  const { usuarioLogado, authStatus } = useApp();

  if (authStatus === 'loading') return null;
  if (!usuarioLogado) return <Navigate to="/login" replace />;

  return children;
}

function HomeRoute() {
  const { usuarioLogado, authStatus } = useApp();

  if (authStatus === 'loading') return null;

  return usuarioLogado ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
      <Route path="/produtos/novo" element={<ProtectedRoute><FichaTecnica /></ProtectedRoute>} />
      <Route path="/produtos/:id/editar" element={<ProtectedRoute><FichaTecnica /></ProtectedRoute>} />
      <Route path="/insumos" element={<ProtectedRoute><Insumos /></ProtectedRoute>} />
      <Route path="/custos-fixos" element={<ProtectedRoute><CustosFixos /></ProtectedRoute>} />
      <Route path="/canais-venda" element={<ProtectedRoute><CanaisVenda /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
      <Route path="/simulacao" element={<ProtectedRoute><Simulacao /></ProtectedRoute>} />
      <Route path="/relatorio" element={<ProtectedRoute><Relatorio /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
