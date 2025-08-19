// sseManager.js
let clients = [];

export function addClient(res) {
  clients.push(res);
}

export function removeClient(res) {
  clients = clients.filter(c => c !== res);
}

export function sendSSE(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(res => res.write(payload));
}
