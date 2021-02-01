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
export const ADD_QUESTION = 'quiz/ADD_QUESTION';
export const addQuestion = createAction(ADD_QUESTION, (actions) => actions);

export const SET_QUESTION = 'quiz/SET_QUESTION';
export const setQuestion = createAction(SET_QUESTION, (actions) => actions);

export const DELETE_QUESTION = 'quiz/DELETE_QUESTION';
export const DELETE_QUESTION_RESULT = 'quiz/DELETE_QUESTION_RESULT';
export const deleteQuestion = createAction(DELETE_QUESTION, (actions) => actions);

export const QUESTION_CHANGE = 'quiz/QUESTION_CHANGE';
export const QUESTION_CHANGE_RESULT = 'quiz/QUESTION_CHANGE_RESULT';
export const questionInfoChange = createAction(QUESTION_CHANGE, (actions) => actions);

// 문항 검색 모달.

export const CHANGE_QUESTIONS_LIST_SEARCH_OPTION = 'quiz/CHANGE_QUESTIONS_LIST_SEARCH_OPTION';
export const changeQuestionsListSearchOption = createAction(CHANGE_QUESTIONS_LIST_SEARCH_OPTION, (actions) => actions);

export const [GET_QUESTIONS_LIST, GET_QUESTIONS_LIST_SUCCESS] = createRequestActionTypes('quiz/GET_QUESTIONS_LIST');
export const getQuestionsList = createAction(GET_QUESTIONS_LIST, (...actions) => actions);

export const SELECT_QUESTIONS = 'jpod/SELECT_QUESTIONS';
export const selectQuestions = createAction(SELECT_QUESTIONS, (actions) => actions);
