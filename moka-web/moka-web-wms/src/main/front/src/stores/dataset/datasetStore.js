import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
const CLEAR_DATASET = 'datasetStore/CLEAR_DATASET';
export const CHANGE_SEARCH_OPTION = 'datasetStore/CHANGE_SEARCH_OPTION';
export const [
    GET_DATASET_LIST,
    GET_DATASET_LIST_SUCCESS,
    GET_DATASET_LIST_FAILURE
] = createRequestActionTypes('datasetStore/GET_DATASET_LIST');
export const [GET_DATASET, GET_DATASET_SUCCESS, GET_DATASET_FAILURE] = createRequestActionTypes(
    'datasetStore/GET_DATASET'
);
export const [POST_DATASET, POST_DATASET_SUCCESS, POST_DATASET_FAILURE] = createRequestActionTypes(
    'datasetStore/POST_DATASET'
);
export const [PUT_DATASET, PUT_DATASET_SUCCESS, PUT_DATASET_FAILURE] = createRequestActionTypes(
    'datasetStore/PUT_DATASET'
);
export const [
    DELETE_DATASET,
    DELETE_DATASET_SUCCESS,
    DELETE_DATASET_FAILURE
] = createRequestActionTypes('datasetStore/DELETE_DATASET');
export const INSERT_DATASET = 'datasetStore/INSERT_DATASET';
export const HAS_RELATIONS = 'datasetStore/HAS_RELATIONS';
export const [COPY_DATASET, COPY_DATASET_SUCCESS, COPY_DATASET_FAILURE] = createRequestActionTypes(
    'datasetStore/COPY_DATASET'
);

/**
 * action creator
 */
export const clearDataset = createAction(CLEAR_DATASET);
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const getDatasetList = createAction(GET_DATASET_LIST, (search) => search);
export const getDataset = createAction(GET_DATASET, ({ datasetSeq, direct, callback }) => ({
    datasetSeq,
    direct,
    callback
}));
export const postDataset = createAction(POST_DATASET, ({ dataset, callback }) => ({
    dataset,
    callback
}));
export const putDataset = createAction(PUT_DATASET, ({ dataset, callback }) => ({
    dataset,
    callback
}));
export const deleteDataset = createAction(DELETE_DATASET, ({ datasetSeq, callback }) => ({
    datasetSeq,
    callback
}));
export const insertDataset = createAction(INSERT_DATASET, ({ apiCodeId, apiHost, apiPath }) => ({
    apiCodeId,
    apiHost,
    apiPath
}));
export const hasRelations = createAction(HAS_RELATIONS, ({ datasetSeq, callback }) => ({
    datasetSeq,
    callback
}));
export const copyDataset = createAction(COPY_DATASET, ({ datasetSeq, datasetName, callback }) => ({
    datasetSeq,
    datasetName,
    callback
}));

/**
 * init
 */
export const defaultDataset = {
    datasetSeq: null,
    datasetName: '',
    apiCodeId: null,
    dataApiHost: null,
    dataApiPath: null,
    dataApi: null,
    dataApiParam: null,
    dataApiParamShape: null,
    description: null,
    autoCreateYn: 'Y'
};

export const initialState = {
    list: null,
    error: null,
    total: 0,
    search: {
        apiCodeId: null,
        apiHost: null,
        apiPath: null,
        autoCreateYn: 'all',
        searchType: 'all',
        keyword: '',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'datasetSeq,desc'
    },
    latestDatasetSeq: null,
    dataset: defaultDataset,
    datasetError: null
};

/**
 * reducer
 */
const datasetStore = handleActions(
    {
        // clear
        [CLEAR_DATASET]: () => initialState,
        // 검색조건 바꾸기
        [CHANGE_SEARCH_OPTION]: (state, { payload: search }) => {
            return produce(state, (draft) => {
                draft.search = search;
            });
        },
        // 목록 조회 성공
        [GET_DATASET_LIST_SUCCESS]: (state, { payload: { body } }) => ({
            ...state,
            list: body && body.list,
            total: body && body.totalCnt,
            error: null
        }),
        // 목록 조회 실패
        [GET_DATASET_LIST_FAILURE]: (state, { payload: error }) => ({
            ...state,
            list: null,
            error
        }),
        // 상세 조회 성공
        [GET_DATASET_SUCCESS]: (state, { payload: { body } }) => {
            // 파라미터, 파라미터정보를 JSON형태로 변환
            let dataApiParamShape = null;
            if (body.dataApiParamShape) {
                const shape = JSON.parse(body.dataApiParamShape);
                if (shape.totalCnt > 0) {
                    dataApiParamShape = { ...shape.list[0].parameter };
                }
            }
            return {
                ...state,
                dataset: {
                    ...body,
                    dataApiParam: body.dataApiParam ? JSON.parse(body.dataApiParam) : null,
                    dataApiParamShape
                },
                latestDatasetSeq: body.datasetSeq,
                datasetError: null
            };
        },
        // 상세 조회 실패
        [GET_DATASET_FAILURE]: (state, { payload: datasetError }) => ({
            ...state,
            datasetError
        }),
        // 추가 성공
        [POST_DATASET_SUCCESS]: (state, { payload: { body } }) => {
            // 파라미터, 파라미터정보를 JSON형태로 변환
            let dataApiParamShape = null;
            if (body.dataApiParamShape) {
                const shape = JSON.parse(body.dataApiParamShape);
                if (shape.totalCnt > 0) {
                    dataApiParamShape = { ...shape.list[0].parameter };
                }
            }
            return {
                ...state,
                dataset: {
                    ...body,
                    dataApiParam: body.dataApiParam ? JSON.parse(body.dataApiParam) : null,
                    dataApiParamShape
                },
                latestDatasetSeq: body.datasetSeq,
                datasetError: null
            };
        },
        // 추가 실패
        [POST_DATASET_FAILURE]: (state, { payload: datasetError }) => ({
            ...state,
            datasetError
        }),
        // 수정 성공
        [PUT_DATASET_SUCCESS]: (state, { payload: { body } }) => {
            // 파라미터, 파라미터정보를 JSON형태로 변환
            let dataApiParamShape = null;
            if (body.dataApiParamShape) {
                const shape = JSON.parse(body.dataApiParamShape);
                if (shape.totalCnt > 0) {
                    dataApiParamShape = { ...shape.list[0].parameter };
                }
            }
            return {
                ...state,
                dataset: {
                    ...body,
                    dataApiParam: body.dataApiParam ? JSON.parse(body.dataApiParam) : null,
                    dataApiParamShape
                },
                latestDatasetSeq: body.datasetSeq,
                datasetError: null
            };
        },
        // 수정 실패
        [PUT_DATASET_FAILURE]: (state, { payload: datasetError }) => ({
            ...state,
            datasetError
        }),
        // 삭제 성공
        [DELETE_DATASET_SUCCESS]: (state) => ({
            ...state,
            dataset: {},
            datasetError: null
        }),
        // 삭제 실패
        [DELETE_DATASET_FAILURE]: (state, { payload: datasetError }) => ({
            ...state,
            datasetError
        }),
        // 추가
        [INSERT_DATASET]: (state, { payload }) => ({
            ...state,
            dataset: {
                ...defaultDataset,
                apiCodeId: payload.apiCodeId,
                dataApiHost: payload.apiHost,
                dataApiPath: payload.apiPath
            },
            latestDatasetSeq: null,
            datasetError: null
        }),
        // 복사 성공
        [COPY_DATASET_SUCCESS]: (state, { payload: { body } }) => {
            // 파라미터, 파라미터정보를 JSON형태로 변환
            let dataApiParamShape = null;
            if (body.dataApiParamShape) {
                const shape = JSON.parse(body.dataApiParamShape);
                if (shape.totalCnt > 0) {
                    dataApiParamShape = { ...shape.list[0].parameter };
                }
            }
            return {
                ...state,
                dataset: {
                    ...body,
                    dataApiParam: body.dataApiParam ? JSON.parse(body.dataApiParam) : null,
                    dataApiParamShape
                },
                latestDatasetSeq: body.datasetSeq,
                datasetError: null
            };
        },
        // 복사 실패
        [COPY_DATASET_FAILURE]: (state, { payload: datasetError }) => ({
            ...state,
            datasetError
        })
    },
    initialState
);

export default datasetStore;
