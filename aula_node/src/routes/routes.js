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

router.get('/usuarios', UsuariosController.listarUsuarios);
router.post('/usuarios', UsuariosController.cadastrarUsuarios);
router.patch('/usuarios', UsuariosController.editarUsuarios);
router.delete('/usuarios', UsuariosController.apagarUsuarios);


router.get('/categorias', CategoriasController.listarCategorias);
router.post('/categorias', CategoriasController.cadastrarCategorias);
router.patch('/categorias', CategoriasController.editarCategorias);
router.delete('/categorias', CategoriasController.apagarCategorias);

router.get('/produtos', ProdutosController.listarProdutos);
router.post('/produtos', ProdutosController.cadastrarProdutos);
router.patch('/produtos', ProdutosController.editarProdutos);
router.delete('/produtos', ProdutosController.apagarProdutos);

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

router.get('/custosVariaveis', CustoVariavelController.listarcustoVariavel);
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

module.exports = router;