const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos (index.html, styles.css, script.js, assets)
app.use(express.static(__dirname));

// Rota principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Carolunhas rodando na porta ${PORT}`);
});
