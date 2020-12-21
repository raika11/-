import qs from 'qs';
import instance from '@store/commons/axios';

// 벌크 리스트 가지고 오기.
export const getBulkList = ({ search }) => {
    return instance.get(`/api/bulks?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 벌크 정보 조회(기사리스트).
export const getBulkArticle = ({ bulkartSeq }) => {
    return instance.get(`/api/bulks/${bulkartSeq}/articles`).catch((err) => {
        throw err;
    });
};

// 약물 정보 가지고 오기.
export const getSpecialchar = () => {
    return instance.get(`/api/codemgt-grps/specialChar/special-char/bulkChar`).catch((err) => {
        throw err;
    });
};

// Copyright 정보 가지고 오기.
export const getCopyright = () => {
    return instance.get(`/api/codemgt-grps/specialChar/special-char/copyright`).catch((err) => {
        throw err;
    });
};

// 약물 정보 변경.
export const putSpecialchar = (putData) => {
    return instance.put(`/api/codemgt-grps/specialChar/special-char?${qs.stringify(putData)}`).catch((err) => {
        throw err;
    });
};

// 벌크 기사들 저장.
export const saveBulkArticle = ({ PostData: { parameter, validList } }) => {
    return instance
        .post(`/api/bulks?${qs.stringify(parameter)}`, validList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 핫클릭 재전송
export const resendHotClick = ({ bulkartSeq }) => {
    return instance.put(`/api/bulks/${bulkartSeq}/resend`).catch((err) => {
        throw err;
    });
};

// 벌크 상태값 변경.
export const putChangeBulkused = ({ bulkartSeq, parameter }) => {
    return instance.put(`/api/bulks/${bulkartSeq}/used?${qs.stringify(parameter)}`).catch((err) => {
        throw err;
    });
};
