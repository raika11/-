import axios from 'axios';

const instance = axios.create();

// API url 변경 시 사용
// instance.defaults.baseURL = '';

// 헤더 설정
// instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default instance;
