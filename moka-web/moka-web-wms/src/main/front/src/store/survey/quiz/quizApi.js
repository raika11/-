import qs from 'qs';
import instance from '../../commons/axios';

export const getQuizzes = ({ search }) => {
    return instance.get(`/api/quizzes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

export const getQuizzesInfo = ({ quizSeq }) => {
    return instance.get(`/api/quizzes/${quizSeq}`).catch((err) => {
        throw err;
    });
};

// 퀴즈 등록.

export const saveQuizzes = ({ formData }) => {
    return instance.post(`/api/quizzes`, formData).catch((err) => {
        throw err;
    });
};
