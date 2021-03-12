import qs from 'qs';
import instance from '@store/commons/axios';

// 메세지 목록조회
export const getTourGuideList = () => {
    return instance.get('/api/tours/guides').catch((err) => {
        throw err;
    });
};

// 메세지 수정(application/json)
export const putTourGuideList = (tourGuideList) => {
    return instance
        .put('/api/tours/guides', tourGuideList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 휴일 목록조회(매년반복)
export const getTourDenyList = () => {
    return instance.get('/api/tours/denys').catch((err) => {
        throw err;
    });
};

// 휴일 등록
export const postTourDeny = (tourDeny) => {
    const queryString = qs.stringify(tourDeny);
    return instance.post(`/api/tours/denys?${queryString}`).catch((err) => {
        throw err;
    });
};

// 휴일 수정
export const putTourDeny = (tourDeny) => {
    const queryString = qs.stringify(tourDeny);
    return instance.put(`/api/tours/denys/${tourDeny.denySeq}?${queryString}`).catch((err) => {
        throw err;
    });
};

// 휴일 삭제
export const deleteTourDeny = ({ denySeq }) => {
    return instance.delete(`/api/tours/denys/${denySeq}`).catch((err) => {
        throw err;
    });
};

// 견학기본설정 조회
export const getTourSetup = () => {
    return instance.get('/api/tours/setup').catch((err) => {
        throw err;
    });
};

// 견학기본설정 수정
export const putTourSetup = (tourSetup) => {
    const queryString = qs.stringify(tourSetup);
    return instance.put(`/api/tours/setup?${queryString}`).catch((err) => {
        throw err;
    });
};

// 신청 목록조회
export const getTourApplyList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/tours/applys?${queryString}`).catch((err) => {
        throw err;
    });
};

// 신청 상세조회
export const getTourApply = ({ tourSeq }) => {
    return instance.get(`/api/tours/applys/${tourSeq}`).catch((err) => {
        throw err;
    });
};

// 신청 수정
export const putTourApply = ({ tourApply }) => {
    return instance
        .put(`/api/tours/applys/${tourApply.tourSeq}`, tourApply, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 견학 가능일 목록조회
export const getTourDenyPossibleList = () => {
    // 일자: possDate
    return instance.get('/api/tours/denys/possible').catch((err) => {
        throw err;
    });
};

// 신청 삭제
export const deleteTourApply = ({ tourSeq }) => {
    return instance.delete(`/api/tours/applys/${tourSeq}`).catch((err) => {
        throw err;
    });
};

// 휴일 목록조회(월별)
export const getTourDenyMonthList = ({ year, month }) => {
    const queryString = qs.stringify({ year, month });
    return instance.get(`/api/tours/denys/month?${queryString}`).catch((err) => {
        throw err;
    });
};

// 견학 신청 목록조회(월별)
export const getTourApplyMonthList = ({ year, month }) => {
    const queryString = qs.stringify({ year, month });
    return instance.get(`/api/tours/applys/month?${queryString}`).catch((err) => {
        throw err;
    });
};

// 견학 신청 비밀번호 초기화
export const postResetPwd = ({ phone }) => {
    const queryString = qs.stringify({ phone });
    return instance.post(`/api/pwd/tour/resest?${queryString}`).catch((err) => {
        throw err;
    });
};

// 이메일 미리보기
export const previewTourMail = ({ tourApply }) => {
    return instance
        .post(`/api/tours/mail-preview`, tourApply, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};
