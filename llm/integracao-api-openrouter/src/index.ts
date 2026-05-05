import { config } from './config';
import {createServer} from './server';
import {openrouterService} from './openrouterService';

const routerService = new openrouterService(config);
const app = createServer(routerService);
await app.listen({port: 3000, host: '0.0.0.0'})

console.log('Server is running on http://localhost:3000');

app.inject ({
    method: 'POST',
    url: '/chat',
    body: {
        question: 'What is the capital of France?'
    }
}).then(response => {
    console.log('Response status:', response.statusCode);
    console.log('Response body:', response.body);
})