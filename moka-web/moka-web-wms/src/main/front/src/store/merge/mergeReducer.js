import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './mergeAction';

/**
 * initialState
 */
export const initialState = {
    content: null,
    snapshotContent: null,
    error: null,
};

export default handleActions(
    {
        /**
         * 미리보기 랜더링
         */
        [act.PREVIEW_PAGE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
            });
        },
        [act.PREVIEW_PAGE_FAILURE]: (state, { payload: error }) => {
            return produce(state, (draft) => {
                draft.error = error;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        /**
         * 컴포넌트 미리보기 랜더링
         */
        [act.PREVIEW_COMPONENT_SUCCESS]: (state, { payload: { body }, resourceYn }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                if (resourceYn && resourceYn === 'N') {
                    draft.snapshotContent = body;
                } else {
                    draft.content = body;
                }
            });
        },
        [act.PREVIEW_COMPONENT_FAILURE]: (state, { payload: error }) => {
            return produce(state, (draft) => {
                draft.content = initialState.content;
                draft.error = error;
            });
        },
        /**
         * W3C검사
         */
        [act.W3C_PAGE_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
            });
        },
        [act.W3C_PAGE_FAILURE]: (state, { payload: error }) => {
            return produce(state, (draft) => {
                draft.error = error;
            });
        },
    },
    initialState,
);
