/**
 * Mão na massa
 * Public API: Exemplo 1
 *  - buscar todos os crocodilos
 *  Critérios:
 *  Smoke test
 *   - 1 usuários por 30 segundos
 * Limites:
 *    - Requisição com sucesso > 99%
 */
import http from 'k6/http';
import { Check, check } from 'k6';
// etapa de configuração do teste
export const options = {
    vus: 1,
    duration: '3s',
    thresholds: {
        checks: ['rate > 0.99']
    }
}
// etapa de execução
export default function() {
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/';

    const res = http.get(BASE_URL);

    check(res, {
        'status code 200': (r) => r.status === 200
    });
}