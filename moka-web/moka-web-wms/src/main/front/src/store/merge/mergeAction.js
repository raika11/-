import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 페이지 미리보기
 */
export const PREVIEW_PAGE = 'merge/PREVIEW_PAGE';
export const previewPage = createAction(PREVIEW_PAGE, ({ content, callback }) => ({
    content,
    callback,
}));

/**
 * 컴포넌트 미리보기
 */
export const [PREVIEW_COMPONENT, PREVIEW_COMPONENT_SUCCESS, PREVIEW_COMPONENT_FAILURE] = createRequestActionTypes('merge/PREVIEW_COMPONENT');
export const previewComponent = createAction(PREVIEW_COMPONENT, ({ pageSeq, componentWorkSeq, resourceYn, callback }) => ({
    pageSeq,
    componentWorkSeq,
    resourceYn,
    callback,
}));

/**
 * 컴포넌트 미리보기 (일시적인 데이터 처리)
 */
export const PREVIEW_COMPONENT_MODAL = 'merge/PREVIEW_COMPONENT_MODAL';
export const previewComponentModal = createAction(PREVIEW_COMPONENT_MODAL, ({ pageSeq, componentWorkSeq, resourceYn, callback }) => ({
    pageSeq,
    componentWorkSeq,
    resourceYn,
    callback,
}));

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'merge/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

/**
 * W3C검사. syntax 체크 -> 머지결과 -> HTML검사
 */
export const W3C_PAGE = 'merge/W3C_PAGE';
export const w3cPage = createAction(W3C_PAGE, ({ content, page, callback }) => ({
    content,
    page,
    callback,
}));
