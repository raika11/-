import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './datasetAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'datasetSeq,desc',
        apiCodeId: null,
        autoCreateYn: 'all',
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'datasetSeq', name: '데이터셋ID' },
        { id: 'datasetName', name: '데이터셋명' },
    ],
    dataset: {},
    datasetError: null,
    invalidList: [],
};

const parseApiCoulnm = (state, body) => {
    let dataApiParamShape = null;
    if (body.dataApiParamShape) {
        const shape = JSON.parse(body.dataApiParamShape);
        if (shape.totalCnt > 0) {
            dataApiParamShape = { ...shape.list[0].parameter };
        }
    }

    return produce(state, (draft) => {
        draft.dataset = {
            ...body,
            dataApiParam: body.dataApiParam ? JSON.parse(body.dataApiParam) : null,
            dataApiParamShape,
        };
        draft.datasetError = initialState.datasetError;
        draft.invalidList = initialState.invalidList;
    });
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [act.CLEAR_DATASET]: (state) => {
            return produce(state, (draft) => {
                draft.dataset = initialState.dataset;
                draft.datasetError = initialState.datasetError;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        /**
         * 데이터셋 조회
         */
        [act.GET_DATASET_SUCCESS]: (state, { payload: { body } }) => {
            return parseApiCoulnm(state, body);
            /*return produce(state, (draft) => {
                draft.dataset = body;
                draft.datasetError = initialState.datasetError;
                draft.invalidList = initialState.invalidList;
            });*/
        },
        [act.GET_DATASET_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.dataset = initialState.dataset;
                draft.datasetError = payload;
                draft.invalidList = payload.body;
            });
        },

        /**
         * 데이터셋 리스트 조회
         */
        [act.GET_DATASET_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_DATASET_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
    },
    initialState,
);
