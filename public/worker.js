let clients = [];
// eslint-disable-next-line no-restricted-globals
self.onconnect = function (event) {
  const port = event.ports[0];
  let client = { port, id: crypto.randomUUID() };
  clients.push(client);
  if (clients.length > 1) {
    clients[0].port.postMessage({
      type: "createTab",
    });
  }

  port.onmessage = function (e) {

    switch (e.data.type) {
      case "startProcess":
        clients[clients.length - 1].port.postMessage({
          type: e.data.type,
          state: { id: clients[clients.length - 1].id, ...e.data.state },
        });
        break;
      case "reaceviedTab":
        clients[0].port.postMessage(e.data);
        break;
      case "updateTabInfo":
        clients[0].port.postMessage(e.data);
        break;
      case "close":
        clients.forEach((client) => client.id === e.data.id ? client.port.postMessage(e.data) : null);
        break;
      default:
        break;
    }
  };
 
};
