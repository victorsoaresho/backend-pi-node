const express = require('express');
const router = express.Router();
const { getUserByLogin } = require('../models/user');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: API para gerenciar usuários
 */

/**
 * @swagger
 * /users/login/{user}/{password}:
 *   get:
 *     summary: Faz login do usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: O login do usuário
 *       - in: path
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: A senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Falha no login
 */
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
