const express = require('express');
const router = express.Router();
const { getAllVagas, getVagasByTipo, createVaga, getFiltroId, createFiltro, associateVagaFiltro, getVagaById } = require('../models/vaga');

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
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               salario:
 *                 type: number
 *               localizacao:
 *                 type: string
 *               requisitos:
 *                 type: string
 *               data_publicacao:
 *                 type: string
 *                 format: date
 *               emprego_id:
 *                 type: integer
 *               tipo_filtro:
 *                 type: string
 *             example:
 *               titulo: "Analista de Dados"
 *               descricao: "Vaga para analista de dados"
 *               salario: 5000
 *               localizacao: "Remoto"
 *               requisitos: "Experiência com python"
 *               data_publicacao: "2024-06-01"
 *               emprego_id: 1
 *               tipo_filtro: "Dados"
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

module.exports = router;
