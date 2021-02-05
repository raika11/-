import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 아젠다 목록 조회
export const getMicAgendaList = ({ search }) => {
    return instance.get(`/api/mics/agendas?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 아젠다 상세 조회
export const getMicAgenda = ({ agndSeq }) => {
    return instance.get(`/api/mics/agendas/${agndSeq}`).catch((err) => {
        throw err;
    });
};

// 아젠다 등록(폼데이터)
export const postMicAgenda = ({ agenda }) => {
    return instance
        .post(`/api/mics/agendas`, objectToFormData(agenda), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 아젠다 수정(폼데이터)
export const putMicAgenda = ({ agenda }) => {
    return instance
        .put(`/api/mics/agendas/${agenda.agndSeq}`, objectToFormData(agenda), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 레포트 (아젠다, 전체 포스트 수)
export const getMicReport = () => {
    return instance.get('/api/mics/report').catch((err) => {
        throw err;
    });
};

// 아젠다 순서 변경(application/json)
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

// 카테고리 목록 조회
export const getMicCategoryList = ({ search }) => {
    return instance.get(`/api/mics/categorys?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 카테고리 수정(application/json)
export const putMicCategory = ({ categoryList }) => {
    return instance
        .put('/api/mics/categorys', categoryList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 카테고리 등록
export const postMicCategory = ({ category }) => {
    return instance.post('/api/mics/categorys', qs.stringify(category)).catch((err) => {
        throw err;
    });
};

// 배너 목록 조회
export const getMicBannerList = ({ search }) => {
    return instance.get(`/api/mics/banners?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 배너 목록 상세 조회
export const getMicBanner = ({ bnnrSeq }) => {
    return instance.get(`/api/mics/banners/${bnnrSeq}`).catch((err) => {
        throw err;
    });
};

// 배너 목록 등록(폼데이터)
export const postMicBanner = ({ banner }) => {
    return instance
        .post(`/api/mics/banners`, objectToFormData(banner), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 배너 사용여부 변경
export const putMicBannerToggle = ({ bnnrSeq }) => {
    return instance.put(`/api/mics/banners/${bnnrSeq}/toggle`).catch((err) => {
        throw err;
    });
};

// 배너 목록 수정(폼데이터)
export const putMicBanner = ({ banner }) => {
    return instance
        .put(`/api/mics/banners/${banner.bnnrSeq}`, objectToFormData(banner), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 답변 목록 조회 (피드, 포스트)
export const getMicAnswerList = ({ search }) => {
    return instance.get(`/api/mics/answers?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 답변 상세 조회 (피드, 포스트)
export const getMicAnswer = ({ answSeq }) => {
    return instance.get(`/api/mics/answers/${answSeq}`).catch((err) => {
        throw err;
    });
};

// 답변 등록 (폼데이터)
export const postMicAnswer = ({ answer }) => {
    return instance
        .post(`/api/mics/answers`, objectToFormData(answer), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 답변 수정 (폼데이터)
export const putMicAnswer = ({ answer }) => {
    return instance
        .put(`/api/mics/answers/${answer.answSeq}`, objectToFormData(answer), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 답변 최상위 수정
export const putMicAnswerTop = ({ answSeq, answTop }) => {
    return instance.put(`/api/mics/answers/${answSeq}/top?${qs.stringify({ answTop })}`).catch((err) => {
        throw err;
    });
};

// 답변 사용여부 수정
export const putMicAnswerUsed = ({ answSeq, usedYn }) => {
    return instance.put(`/api/mics/answers/${answSeq}/used?${qs.stringify({ usedYn })}`).catch((err) => {
        throw err;
    });
};
