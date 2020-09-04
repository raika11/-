import { createAction, handleActions } from 'redux-actions';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

// action : 미리보기
export const [PREVIEW_PAGE, PREVIEW_PAGE_SUCCESS, PREVIEW_PAGE_FAILURE] = createRequestActionTypes(
    'mergeStore/PREVIEW_PAGE'
);
export const [
    PREVIEW_COMPONENT,
    PREVIEW_COMPONENT_SUCCESS,
    PREVIEW_COMPONENT_FAILURE
] = createRequestActionTypes('mergeStore/PREVIEW_COMPONENT');
// action : W3C검사. syntax 체크 -> 머지결과 -> HTML검사
export const [W3C_PAGE, W3C_PAGE_SUCCESS, W3C_PAGE_FAILURE] = createRequestActionTypes(
    'mergeStore/W3C_PAGE'
);

// action creator : 페이지 미리보기
export const previewPage = createAction(PREVIEW_PAGE, ({ content, url, page }) => ({
    content,
    url,
    page
}));
// action creator : 컴포넌트 미리보기
export const previewComponent = createAction(
    PREVIEW_COMPONENT,
    ({ pageSeq, componentWorkSeq, resourceYn }) => ({
        pageSeq,
        componentWorkSeq,
        resourceYn
    })
);

// action creator : W3C검사
export const w3cPage = createAction(W3C_PAGE, ({ content, page }) => ({
    content,
    page
}));

/**
 * init
 */
const initialState = {
    content: null,
    error: null
};

/**
 * reducer
 */
const mergeStore = handleActions(
    {
        // 미리보기 랜더링 성공
        [PREVIEW_PAGE_SUCCESS]: (state) => ({
            ...state,
            error: null
        }),
        // 미리보기 랜더링 실패
        [PREVIEW_PAGE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error
        }),
        // 컴포넌트 미리보기 랜더링 성공
        [PREVIEW_COMPONENT_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            content: body,
            error: null
        }),
        // 컴포넌트 미리보기 랜더링 실패
        [PREVIEW_COMPONENT_FAILURE]: (state, { payload: error }) => ({
            ...state,
            content: null,
            error
        }),
        // W3C검사 성공
        [W3C_PAGE_SUCCESS]: (state) => ({
            ...state,
            error: null
        }),
        // W3C검사 실패
        [W3C_PAGE_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error
        })
    },
    initialState
);

export default mergeStore;
