const express = require('express');
const router = express.Router();
const { getAllVagas, getVagasByTipo, createVaga, getFiltroId, createFiltro, associateVagaFiltro, getVagaById } = require('../models/vaga');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vaga:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - salario
 *         - localizacao
 *         - requisitos
 *         - data_publicacao
 *         - emprego_id
 *         - tipo_filtro
 *       properties:
 *         titulo:
 *           type: string
 *           description: O título da vaga
 *         descricao:
 *           type: string
 *           description: A descrição da vaga
 *         salario:
 *           type: number
 *           description: O salário da vaga
 *         localizacao:
 *           type: string
 *           description: A localização da vaga
 *         requisitos:
 *           type: string
 *           description: Os requisitos da vaga
 *         data_publicacao:
 *           type: string
 *           format: date
 *           description: A data de publicação da vaga
 *         emprego_id:
 *           type: integer
 *           description: O ID do emprego relacionado
 *         tipo_filtro:
 *           type: string
 *           description: O tipo de filtro da vaga
 *       example:
 *         titulo: Desenvolvedor Backend
 *         descricao: Vaga para desenvolvedor backend
 *         salario: 5000
 *         localizacao: Remoto
 *         requisitos: Experiência com Node.js
 *         data_publicacao: 2024-06-06
 *         emprego_id: 1
 *         tipo_filtro: Backend
 */

/**
 * @swagger
 * tags:
 *   name: Vagas
 *   description: API para gerenciar vagas
 */

/**
 * @swagger
 * /vagas:
 *   get:
 *     summary: Retorna a lista de todas as vagas
 *     tags: [Vagas]
 *     responses:
 *       200:
 *         description: A lista de vagas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vaga'
 */
router.get('/', async (req, res) => {
  try {
    const vagas = await getAllVagas();
    res.json({ vagas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /vagas/{tipo}:
 *   get:
 *     summary: Retorna a lista de vagas filtradas pelo tipo
 *     tags: [Vagas]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         schema:
 *           type: string
 *         required: true
 *         description: O tipo de vaga a ser filtrado (por exemplo, 'Front End', 'Back End')
 *     responses:
 *       200:
 *         description: A lista de vagas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vaga'
 */
router.get('/:tipo', async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const vagas = await getVagasByTipo(tipo);
    res.json({ vagas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /inserir:
 *   post:
 *     summary: Insere uma nova vaga
 *     tags: [Vagas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vaga'
 *     responses:
 *       200:
 *         description: Vaga inserida com sucesso
 *       409:
 *         description: Vaga já cadastrada
 *       500:
 *         description: Erro ao inserir a vaga
 */
router.post('/inserir', async (req, res) => {
  try {
    const vaga = req.body;

    // Verificar se a vaga já está cadastrada
    const vagasExistentes = await getVagasByTipo(vaga.titulo);
    if (vagasExistentes.length > 0) {
      return res.status(409).json({ fail: 'Vaga já cadastrada!' });
    }

    const vagaId = await createVaga(vaga);
    
    let filtroId = await getFiltroId(vaga.tipo_filtro);
    if (!filtroId) {
      filtroId = await createFiltro(vaga.tipo_filtro);
    }
    
    await associateVagaFiltro(vagaId, filtroId);
    
    res.json({ success: 'Vaga inserida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /detalhamento/{id}:
 *   get:
 *     summary: Retorna o detalhamento de uma vaga pelo ID
 *     tags: [Vagas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da vaga
 *     responses:
 *       200:
 *         description: Detalhamento da vaga
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vaga'
 *       404:
 *         description: Vaga não encontrada
 */
router.get('/detalhamento/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const vaga = await getVagaById(id);

    if (vaga) {
      res.json(vaga);
    } else {
      res.status(404).json({ error: 'Vaga não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
