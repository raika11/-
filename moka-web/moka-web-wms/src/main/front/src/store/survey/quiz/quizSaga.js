import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import toast from '@/utils/toastUtil';

import {
    GET_QUIZZES_LIST,
    GET_QUIZZES,
    GET_QUIZZES_SUCCESS,
    SAVE_QUIZZES,
    QUESTION_CHANGE,
    QUESTION_CHANGE_RESULT,
    DELETE_QUESTION,
    DELETE_QUESTION_RESULT,
    GET_QUESTIONS_LIST,
    GET_QUIZ_SEARCH_MODAL_LIST,
} from './quizAction';
import { getQuizzes, getQuizzesInfo, saveQuizzes, updateQuizzes, getQuestions } from './quizApi';

// 퀴즈 목록 죄회.
const getQuizzesListSaga = callApiAfterActions(GET_QUIZZES_LIST, getQuizzes, (state) => state.quiz.quizzes);
const getQuestionsListSaga = callApiAfterActions(GET_QUESTIONS_LIST, getQuestions, (state) => state.quiz.quizQuestionList);
const getQuizSearchListSaga = callApiAfterActions(GET_QUIZ_SEARCH_MODAL_LIST, getQuizzes, (state) => state.quiz.quizSearchList);

function* getQuizzesSaga({ payload: { quizSeq } }) {
    yield put(startLoading(GET_QUIZZES));
    let response;
    try {
        response = yield call(getQuizzesInfo, { quizSeq: quizSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_QUIZZES_SUCCESS, payload: response.data });
        } else {
            // 에러 나면 서버 에러 메시지 토스트 전달.
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    yield put(finishLoading(GET_QUIZZES));
}

function* saveQuizzesSaga({ payload: { type, quizSeq, formData, callback } }) {
    const ACTION = SAVE_QUIZZES;
    let callbackData = {};

    yield put(startLoading(ACTION));
    let response;

    try {
        if (type === 'UPDATE') {
            response = yield call(updateQuizzes, { quizSeq: quizSeq, formData: formData });
        } else {
            response = yield call(saveQuizzes, { formData: formData });
        }

        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

function* questionInfoChangeSaga({ payload }) {
    const tempPayload = payload;
    delete tempPayload.tempPayload;

    const questionsList = yield select((store) => store.quiz.quizQuestions.questionsList);

    const { questionIndex } = payload;

    // const resultState = (questionsList[questionIndex] = payload);

    const resultState = questionsList.map((e, index) => {
        if (questionIndex === index) {
            delete payload.questionIndex;
            return tempPayload;
        } else {
            return e;
        }
    });

    yield put({ type: QUESTION_CHANGE_RESULT, payload: resultState });
}

function* deleteQuestionSaga({ payload: { questionIndex } }) {
    const questionsItem = yield select((store) => store.quiz.quizQuestions.questionsItem);
    const questionsList = yield select((store) => store.quiz.quizQuestions.questionsList);

    yield put({
        type: DELETE_QUESTION_RESULT,
        payload: {
            item: questionsItem.filter((e, index) => index !== Number(questionIndex)),
            list: questionsList.filter((e, index) => index !== Number(questionIndex)),
        },
    });
}

export default function* quizSaga() {
    yield takeLatest(GET_QUIZZES_LIST, getQuizzesListSaga);
    yield takeLatest(GET_QUIZZES, getQuizzesSaga);
    yield takeLatest(SAVE_QUIZZES, saveQuizzesSaga);
    yield takeLatest(QUESTION_CHANGE, questionInfoChangeSaga);
    yield takeLatest(DELETE_QUESTION, deleteQuestionSaga);
    yield takeLatest(GET_QUESTIONS_LIST, getQuestionsListSaga);
    yield takeLatest(GET_QUIZ_SEARCH_MODAL_LIST, getQuizSearchListSaga);
}
