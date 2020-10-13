import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const instance = axios.create();

instance.defaults.withCredentials = true;

// API url 변경 시 사용
instance.defaults.baseURL = API_BASE_URL;

// 헤더 설정
// instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default instance;
