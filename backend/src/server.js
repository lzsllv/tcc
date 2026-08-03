const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./prisma'); // importa o client

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    res.json({ ok: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Erro ao conectar ao banco.' });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});