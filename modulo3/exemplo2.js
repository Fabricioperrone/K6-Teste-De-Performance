/**
 * Mão na massa
 * Public API: Exemplo 2
 *  - Buscar crocodilo por ID
 * Crtérios:
 *  - Performance de test
 *    - Ramp up 10  VU (Usuário virtual) em 10 segundos
 *    - Carga 10 VU por 10 segundos
 *    - Ramp down 0 VU em 10 segundos
 * Limites:
 *     - Requisição com sucesso > 95%
 *     - Tempo de requisição p(90) < 200
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// etapa de configuração do teste
export const options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

const data = new SharedArray('leitura do json', function() {
    return JSON.parse(open('/dados.json')).users;
})

// etapa de execução

export default function () {

    const userId = data[Math.floor(Math.random() * data.length)].id;
    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${userId}`;

    const res = http.get(BASE_URL);

    check(res, {
        'status code 200': (r) => r.status === 200
    });

    sleep(1)
}