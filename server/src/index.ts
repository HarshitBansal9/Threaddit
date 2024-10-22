import app from './app';
import http from 'http';
import { PORT } from './config/environment';

function normalizePort(val:string){
    const port = parseInt(val, 10);
    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
}

const port = normalizePort(PORT);

app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`Listening on ${bind}`);
});

