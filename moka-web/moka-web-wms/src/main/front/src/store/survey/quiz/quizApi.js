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
    return instance
        .post(`/api/quizzes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 퀴즈 수정.
export const updateQuizzes = ({ quizSeq, formData }) => {
    return instance
        .put(`/api/quizzes/${quizSeq}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

export const getQuestions = ({ search }) => {
    return instance.get(`/api/quizzes/questions?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

export const getQuizzesQuestions = ({ questionSeq }) => {
    return instance.get(`/api/quizzes/questions/${questionSeq}`).catch((err) => {
        throw err;
    });
};
