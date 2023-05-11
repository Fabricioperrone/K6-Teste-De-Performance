/**
 * Mão na massa
 * Registration e auth login
 *  - Relizar  o login com um novo usuário
 * Critérios:
 *  - Stress test
 *  - Ramp up 5 VU em 5s
 *  - Carga 5 VU em 5s
 *  - Ramp up 50 VU em 2s
 *  - Carga de 50 UV em 2s
 *  - Ramp down 0 VU em 5s
 * Limites:
 *  - Requisição com falha  inferior a 1%
 */
import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export  const options = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '5s', target: 5 },
        { duration: '2s', target: 50 },
        { duration: '2s', target: 50 },
        { duration: '5s', target: 0 },
    ],
        
    thresholds: {
        http_req_failed: ['rate < 0.01'],
    }
};

const csvData = new SharedArray('Ler dados', function() {
    return papaparse.parse(open('./usuarios.csv'), {header: false}).data;
})

export default function () {
    const USER = csvData[Math.floor(Math.random() * csvData.length)].email;
    const PASS = 'user123'
    const BASE_URL = 'https://test-api.k6.io';

    console.log( USER );

    const res = http.post(`${BASE_URL}/auth/token/login/`, {
        username: USER,
        password: PASS
    });

    check(res, {
        'sucesso login': (r) => r.status === 200,
        'token gerado': (r) => r.json('access') != ''
    });

    sleep(1)
}

