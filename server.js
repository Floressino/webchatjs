const ws = require('ws');
const writeFile = require('fs');
const {v4: uuid} = require('uuid');
const clients = {};
const messages = [];

const wss = new ws.Server({port: 8000});

wss.on('connection', (ws) => {
    const id = uuid();
    clients[id] = ws;

    console.log(`New client ${id}`);
    ws.send(JSON.stringify(messages));

    ws.on('message', (rawMessage) => {
        // console.log(rawMessage);
        const {name, message} = JSON.parse(rawMessage);
        messages.push({name, message});
        for (const id in clients) {
            clients[id].send(JSON.stringify([{name, message}]));
        };
    });

    ws.on('close', () => {
        delete clients[id];
        console.log(`Clients ${id} close connection`);
    });
});