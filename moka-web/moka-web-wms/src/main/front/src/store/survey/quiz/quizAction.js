import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const CLEAR_STORE = 'quiz/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);
export const CLEAR_QUIZINFO = 'quiz/CLEAR_QUIZINFO';
export const clearQuizinfo = createAction(CLEAR_QUIZINFO);

// 목록 검색 옵션 처리.
export const CHANGE_SEARCH_OPTION = 'quiz/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (actions) => actions);

export const [GET_QUIZZES_LIST, GET_QUIZZES_LIST_SUCCESS, GET_QUIZZES_LIST_FAILURE] = createRequestActionTypes('quiz/GET_QUIZZES_LIST');
export const getQuizzesList = createAction(GET_QUIZZES_LIST, (...actions) => actions);

// 퀴즈 정보 조회.
export const [GET_QUIZZES, GET_QUIZZES_SUCCESS, GET_QUIZZES_FAILURE] = createRequestActionTypes('quiz/GET_QUIZZES');
export const getQuizzes = createAction(GET_QUIZZES, ({ quizSeq }) => ({ quizSeq }));

// 취즈 등록, 수정
export const SAVE_QUIZZES = 'quiz/SAVE_QUIZZES';
export const saveQuizzes = createAction(SAVE_QUIZZES, ({ type, quizSeq, formData, callback }) => ({ type, quizSeq, formData, callback }));

// 문항
export const QUIZ_QUESTION_ITEM = 'quiz/QUIZ_QUESTION_ITEM';
export const quizQuestionItem = createAction(QUIZ_QUESTION_ITEM, (...actions) => actions);
