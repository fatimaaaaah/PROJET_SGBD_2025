const fetch = require('node-fetch');

async function corrigerExercice(prompt) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-coder',
      prompt: prompt,
      stream: false
    })
  });

  const data = await response.json();
  return data.response;
}

module.exports = { corrigerExercice };
