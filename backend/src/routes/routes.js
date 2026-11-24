const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios');
const CategoriasController = require('../controllers/categorias');
const ProdutosController = require('../controllers/produtos');
const EmpresasController = require('../controllers/empresas');
const SimulacaoController = require('../controllers/simulacao');
const CustoFixoController = require('../controllers/custoFixo');
const CustoVariavelController = require('../controllers/custoVariavel');
const HistoricoController = require('../controllers/historico');
const ParametrosController = require('../controllers/parametros');
const PrecificacaoController = require('../controllers/precificacao');
const RegiaoController = require('../controllers/regiao');
const InsumosController = require('../controllers/insumos');
const OfertasController = require('../controllers/ofertas');
const CanaisVendaController = require('../controllers/canaisVenda');
const ConfiguracoesController = require('../controllers/configuracoes');
const WorkspaceController = require('../controllers/workspace');
const upload = require('../middlewares/upload');

router.get('/usuarios', UsuariosController.listarUsuarios);
router.post('/usuarios', UsuariosController.cadastrarUsuarios);
router.patch('/usuarios', UsuariosController.editarUsuarios);
router.delete('/usuarios', UsuariosController.apagarUsuarios);

router.post('/login', UsuariosController.login);
router.patch('/alterar-senha', UsuariosController.alterarSenha);

router.get('/categorias', CategoriasController.listarCategorias);
router.post('/categorias', CategoriasController.cadastrarCategorias);
router.patch('/categorias', CategoriasController.editarCategorias);
router.delete('/categorias', CategoriasController.apagarCategorias);

router.get('/produtos', ProdutosController.listarProdutos);
router.post(
    '/produtos',
    upload.single('imagem'),
    ProdutosController.cadastrarProdutos
);
router.patch(
    '/produtos',
    upload.single('imagem'),
    ProdutosController.editarProdutos
);
router.patch('/produtos/arquivar', ProdutosController.arquivarProdutos);
router.delete('/produtos', ProdutosController.apagarProdutos);

router.get('/produtos-empresas', ProdutosController.listarProdutosComEmpresa);
router.get('/produtos-busca', ProdutosController.buscarProdutos);
router.get('/produtos-paginados', ProdutosController.listarProdutosPaginados);
router.get('/produtos-aleatorio', ProdutosController.listarProdutoAleatorio);

router.get('/empresas', EmpresasController.listarEmpresas);
router.post('/empresas', EmpresasController.cadastrarEmpresas);
router.patch('/empresas', EmpresasController.editarEmpresas);
router.delete('/empresas', EmpresasController.apagarEmpresas);

router.get('/simulacoes', SimulacaoController.listarSimulacao);
router.post('/simulacoes', SimulacaoController.cadastrarSimulacao);
router.patch('/simulacoes', SimulacaoController.editarSimulacao);
router.delete('/simulacoes', SimulacaoController.apagarSimulacao);

router.get('/custosFixos', CustoFixoController.listarcustoFixo);
router.post('/custosFixos', CustoFixoController.cadastrarcustoFixo);
router.patch('/custosFixos', CustoFixoController.editarcustoFixo);
router.delete('/custosFixos', CustoFixoController.apagarcustoFixo);

router.get('/custosVariaveis', CustoVariavelController.listarCustoVariavel);
router.post('/custosVariaveis', CustoVariavelController.cadastrarcustoVariavel);
router.patch('/custosVariaveis', CustoVariavelController.editarcustoVariavel);
router.delete('/custosVariaveis', CustoVariavelController.apagarcustoVariavel);

router.get('/historicos', HistoricoController.listarHistorico);
router.post('/historicos', HistoricoController.cadastrarHistorico);
router.patch('/historicos', HistoricoController.editarHistorico);
router.delete('/historicos', HistoricoController.apagarHistorico);

router.get('/parametros', ParametrosController.listarParametro);
router.post('/parametros', ParametrosController.cadastrarParametro);
router.patch('/parametros', ParametrosController.editarParametro);
router.delete('/parametros', ParametrosController.apagarParametro);

router.get('/precificacoes', PrecificacaoController.listarPrecificacao);
router.post('/precificacoes', PrecificacaoController.cadastrarPrecificacao);
router.patch('/precificacoes', PrecificacaoController.editarPrecificacao);
router.delete('/precificacoes', PrecificacaoController.apagarPrecificacao);

router.get('/regioes', RegiaoController.listarRegiao);
router.post('/regioes', RegiaoController.cadastrarRegiao);
router.patch('/regioes', RegiaoController.editarRegiao);
router.delete('/regioes', RegiaoController.apagarRegiao);

router.get('/estados', RegiaoController.listarEstados);
router.get('/estados/tratados', RegiaoController.listarEstadosTratados);
router.get('/regioes-busca', RegiaoController.buscarRegiaoPorEstado);


// Recursos correspondentes aos dados utilizados pelo front-end atual.
router.get('/insumos', InsumosController.listar);
router.post('/insumos', InsumosController.cadastrar);
router.patch('/insumos', InsumosController.editar);
router.delete('/insumos', InsumosController.excluir);

router.get('/ofertas', OfertasController.listar);
router.post('/ofertas', OfertasController.cadastrar);
router.patch('/ofertas', OfertasController.editar);
router.delete('/ofertas', OfertasController.excluir);

router.get('/canais-venda', CanaisVendaController.listar);
router.post('/canais-venda', CanaisVendaController.cadastrar);
router.patch('/canais-venda', CanaisVendaController.editar);
router.delete('/canais-venda', CanaisVendaController.excluir);

router.get('/configuracoes/:id_empresa', ConfiguracoesController.listar);
router.put('/configuracoes/:id_empresa', ConfiguracoesController.salvar);

router.get('/workspace/:id_empresa/custos-fixos', WorkspaceController.listarCustosFixos);
router.put('/workspace/:id_empresa/custos-fixos', WorkspaceController.salvarCustosFixos);

module.exports = router;