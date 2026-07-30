const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Este email já está em uso.' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password_hash,
        },
      });

      return res.status(201).json({
        message: 'Usuário criado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.json({
        message: 'Login realizado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
  },
};

module.exports = authController;
