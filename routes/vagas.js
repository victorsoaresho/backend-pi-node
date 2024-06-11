const express = require('express');
const router = express.Router();
const { getAllVagas, getVagasByTipo, createVaga, getFiltroId, createFiltro, associateVagaFiltro } = require('../models/vaga');

router.get('/', async (req, res) => {
  try {
    const vagas = await getAllVagas();
    res.json({ vagas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:tipo', async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const vagas = await getVagasByTipo(tipo);
    res.json({ vagas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alterado de /vagas para /inserir
router.post('/inserir', async (req, res) => {
  try {
    const vaga = req.body;
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
