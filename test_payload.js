const fs = require('fs');
const p = {
  provider: 'groq',
  messages: [{ role: 'user', content: 'hello' }],
  model: 'llama3.2',
  temperature: 0.7,
  stream: false
};
fs.writeFileSync('/app/data/test_payload.json', JSON.stringify(p));
console.log('Payload written');
