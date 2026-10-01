import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import Cadastro from '../pages/cadastro/page';
import CanaisVenda from '../pages/canais-venda/page';
import Configuracoes from '../pages/configuracoes/page';
import CustosFixos from '../pages/custos-fixos/page';
import Dashboard from '../pages/dashboard/page';
import FichaTecnica from '../pages/ficha-tecnica/page';
import Insumos from '../pages/insumos/page';
import LandingPage from '../pages/landing/page';
import Login from '../pages/login/page';
import NotFound from '../pages/not-found/page';
import Produtos from '../pages/produtos/page';
import Relatorio from '../pages/relatorio/page';
import Simulacao from '../pages/simulacao/page';

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
