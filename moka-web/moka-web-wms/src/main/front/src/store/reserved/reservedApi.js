import qs from 'qs';
import instance from '../commons/axios';

// 예약어목록 조회
export const getReservedList = ({ search }) => {
    return instance.get(`/api/reserveds?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 예약어 등록
export const postReserved = ({ reserved }) => {
    const reservedSet = {
        ...reserved,
        'domain.domainId': reserved.domainId,
    };
    return instance.post('/api/reserveds', qs.stringify(reservedSet)).catch((err) => {
        throw err;
    });
};

// 예약어 삭제
export const deleteReserved = (reservedSeq) => {
    return instance.delete(`/api/reserveds/${reservedSeq}`).catch((err) => {
        throw err;
    });
};

// 예약어정보 조회
export const getReserved = (reservedSeq) => {
    return instance.get(`/api/reserveds/${reservedSeq}`).catch((err) => {
        throw err;
    });
};

// 예약어 수정
export const putReserved = ({ reserved }) => {
    const reservedSet = {
        reservedSeq: reserved.reservedSeq,
        reservedId: reserved.reservedId,
        reservedValue: reserved.reservedValue,
        description: reserved.description,
        useYn: reserved.useYn,
        'domain.domainId': reserved.domain.domainId,
    };
    return instance.put(`/api/reserveds/${reserved.reservedSeq}`, qs.stringify(reservedSet)).catch((err) => {
        throw err;
    });
};
