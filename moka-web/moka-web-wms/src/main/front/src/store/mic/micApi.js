import qs from 'qs';
import instance from '@store/commons/axios';

// 아젠다 목록 조회
export const getMicAgendaList = ({ search }) => {
    return instance.get(`/api/mics/agendas?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 레포트 (아젠다, 전체 포스트 수)
export const getMicReport = () => {
    return instance.get('/api/mics/report').catch((err) => {
        throw err;
    });
};

// 아젠다 순서 변경
export const putMicAgendaSort = ({ sortedList }) => {
    return instance
        .put('/api/mics/agendas/sort', sortedList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};