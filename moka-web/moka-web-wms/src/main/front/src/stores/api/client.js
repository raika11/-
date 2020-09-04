import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const client = axios.create();

client.defaults.withCredentials = true;

// API 주소를 다른 곳으로 사용함. 로컬에서 http://localhost:8080
client.defaults.baseURL = API_BASE_URL;

// 헤더 설정 : json으로 응답 받기를 원할 경우 설정한다.
// client.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 로컬스토리지에 Authorization이 있으면 셋팅한다
// if (getLocalItem({ key: 'Authorization' })) {
//     client.defaults.headers.common['Authorization'] = getLocalItem({ key: 'Authorization' });
// }

// export const changeRequestHeaderAuth = (authorization) => {
//     const orgHeaders = client.defaults.headers;
//     Object.assign(client.defaults, {
//         headers: { ...orgHeaders, Authorization: authorization }
//     });
// };

export default client;
