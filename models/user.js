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
 * /users/login:
 *   post:
 *     summary: Faz login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: O login do usuário
 *               password:
 *                 type: string
 *                 description: A senha do usuário
 *             example:
 *               user: usuario
 *               password: senha
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Falha no login
 */
router.post('/login', async (req, res) => {
  try {
    const { user, password } = req.body;
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
