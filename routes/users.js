const express = require('express');
const router = express.Router();
const { getUserByLogin } = require('../models/user');

router.get('/login/:user/:password', async (req, res) => {
  try {
    const user = req.params.user;
    const password = req.params.password;
    const usuario = await getUserByLogin(user);

    if (usuario) {
      if (password === usuario.senha) {
        res.json({ success: 'Efetuado com sucesso!' });
      } else {
        res.json({ fail: 'Senha incorreta!' });
      }
    } else {
      res.json({ fail: 'Usuário não encontrado!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
