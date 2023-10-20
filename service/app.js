const express = require('express');
const bodyParser = require('body-parser');
const sanitizeHtml = require('sanitize-html');

const app = express();
app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  const message = 'Hello!';
  res.json({ message });
})

app.post('/hello', (req, res) => {
  const { name } = req.body;
  const sanitizedName = sanitizeHtml(name);
  const message = `Hello ${sanitizedName}`;
  res.json({ message });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
