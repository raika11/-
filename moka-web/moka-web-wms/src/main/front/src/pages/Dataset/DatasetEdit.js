import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import { API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_CODE_ID, API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID, DESKING_API } from '@/constants';
import { MokaCard } from '@components';
import { initialState, changeDataset, clearDataset, copyDataset, GET_DATASET, getDataset, getDatasetListModal, SAVE_DATASET, saveDataset, DELETE_DATASET } from '@store/dataset';
import toast from '@utils/toastUtil';
import BasicForm from './components/BasicForm';
import OptionsForm from './components/OptionsForm';

const defaultSearch = {
    apiCodeId: null,
    searchType: 'datasetSeqLike',
    keyword: '',
    page: 0,
    size: 999,
    sort: 'datasetSeq,desc',
    listType: 'auto',
};

/**
 * 데이터셋 정보/수정
 */
const DatasetEdit = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { datasetSeq } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_DATASET] || loading[SAVE_DATASET] || loading[DELETE_DATASET]);
    const { dataset: storeDataset, search: storeSearch } = useSelector(({ dataset }) => dataset, shallowEqual);

    // state
    const [temp, setTemp] = useState(initialState.dataset);
    const [error, setError] = useState({});
    const [options, setOptions] = useState({
        [API_PARAM_HINT_DATASET_SEQ]: [],
        [API_PARAM_HINT_BUSE_ID]: [],
        [API_PARAM_HINT_GIJA_ID]: [],
        [API_PARAM_HINT_SERIES_ID]: [],
        [API_PARAM_HINT_CODE_ID]: [],
    });

    /**
     * validation check
     * @param tmp 등록/수정 dataset
     * @returns {boolean} validate 여부
     */
    const validate = (tmp) => {
        let invalidated = { ...error };
        let isInvalid = false;

        if (!tmp.datasetName || tmp.datasetName === '') {
            invalidated = { ...invalidated, datasetName: true };
        }

        const apiParam = tmp.dataApiParam;
        const paramDef = tmp.dataApiParamShape?.parameter;
        if (paramDef) {
            for (const key of Object.keys(paramDef)) {
                const keyDef = paramDef[key];

                if (keyDef.require) {
                    if (!apiParam[key]) {
                        invalidated = { ...invalidated, [key]: true };
                    }
                } else if (keyDef.filter) {
                    const regex = new RegExp(keyDef.filter);
                    if (apiParam[key] && !regex.test(apiParam[key])) {
                        invalidated = { ...invalidated, [key]: true };
                    }
                } else {
                    invalidated = { ...invalidated, [key]: false };
                }
            }
        }

        for (const value of Object.values(invalidated)) {
            isInvalid = isInvalid | value;
        }

        setError(invalidated);
        return !isInvalid;
    };

    /**
     * 저장 이벤트
     * @param {Object} event javascript event
     */
    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const tmp = {
            ...storeDataset,
            ...temp,
            apiCodeId: storeSearch.apiCodeId,
        };

        if (validate(tmp)) {
            // saga에서 후처리함
            if (tmp.datasetSeq) {
                updateDataset(tmp);
            } else {
                insertDataset(tmp);
            }
        }
    };

    /**
     * 자동완성 데이터를 넣어주기 위한 callback 함수
     * @param payload 조회한 데이터에 대한 결과 값
     */
    const responseCallback = useCallback(
        (payload) => {
            const { header, body, payload: param } = payload;
            if (header.success) {
                const option = body.list.map((data) => ({
                    value: '' + data.datasetSeq,
                    label: data.datasetName,
                }));

                setOptions({ ...options, [param.type]: option });
            } else {
            }
        },
        [options],
    );

    /**
     * 자동완성 데이타셋 데이터 조회
     * @param search 검색 값
     */
    const handleDatasetSearch = useCallback(
        (search) => {
            if (options[API_PARAM_HINT_DATASET_SEQ].length === 0 && search.apiCodeId) {
                dispatch(
                    getDatasetListModal({
                        search,
                        callback: responseCallback,
                        type: API_PARAM_HINT_DATASET_SEQ,
                    }),
                );
            }
        },
        [dispatch, options, responseCallback],
    );

    /**
     * Api 모달 저장 이벤트
     * @param {Object} selectApi 선택한 API
     * @param {function} hideCallback 숨김 함수
     */
    const handleSaveApi = (selectApi, hideCallback) => {
        const parameters = selectApi.parameter;

        if (parameters) {
            const apiParam = Object.keys(parameters).reduce((all, cu) => ({ ...all, [cu]: parameters[cu].defaultValue }), {});
            setError({ ...error, dataApiUrl: false });
            setTemp({
                ...temp,
                dataApi: selectApi.id,
                dataApiParam: apiParam,
                dataApiParamShape: selectApi,
            });
            hideCallback();
        } else {
            toast.warning('하나 이상의 자동 데이터셋을 선택해 주세요.');
        }
    };

    /**
     * DataApiUrl을 만들기 위한 함수
     * @param {String} dataApi dataAPI
     * @param {String} dataApiParam dataAPI Parameter
     * @returns {String} dataApiUrl
     */
    const makeDataApiUrl = (dataApi, dataApiParam) => {
        let dataApiUrl = dataApi;
        if (dataApiParam && Object.keys(dataApiParam).length > 0) {
            dataApiUrl += `?${qs.stringify(dataApiParam, { plainObjects: true })}`;
        }

        return dataApiUrl;
    };

    /**
     * 데이터셋 관리 수정
     * @param {object} tmp 데이터셋
     */
    const updateDataset = (tmp) => {
        dispatch(
            saveDataset({
                type: 'update',
                actions: [
                    changeDataset({
                        ...storeDataset,
                        ...tmp,
                    }),
                ],
                callback: (response) => toast.result(response),
            }),
        );
    };

    /**
     * 데이터셋 등록
     * @param {object} tmp 데이터셋
     */
    const insertDataset = (tmp) => {
        dispatch(
            saveDataset({
                type: 'insert',
                actions: [
                    changeDataset({
                        ...storeDataset,
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    toast.result(response);
                    if (response.header.success) {
                        history.push(`${match.path}/${response.body.datasetSeq}`);
                    }
                },
            }),
        );
    };

    /**
     * 데이터셋 복사
     * @param {object} data 정보
     * @param callback 저장시 동작할 callback 함수
     */
    const handleCopy = (data, callback) => {
        if (data.value) {
            dispatch(
                copyDataset({
                    datasetSeq,
                    datasetName: data.value,
                    callback: (response) => {
                        const { header, body } = response;
                        toast.result(response);
                        if (header.success) {
                            history.push(`${match.path}/${body.datasetSeq}`);
                        }
                    },
                }),
            );
        } else {
            callback(true);
        }
    };

    /**
     * 취소
     */
    const handleClickCancle = () => history.push(match.path);

    /**
     * 데이터보기 클릭 이벤트
     * @param {object} e javascript event
     */
    const handleClickOpenDataView = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let url = `${storeDataset.dataApiHost}/${storeDataset.dataApiPath}/`;
        if (temp.autoCreateYn === 'Y') {
            url += `${temp.dataApi}?${qs.stringify(temp.dataApiParam)}`;
        } else {
            url += DESKING_API + datasetSeq;
        }

        window.open(url);
    };

    useEffect(() => {
        if (datasetSeq) {
            dispatch(
                getDataset({
                    datasetSeq,
                    callback: (response) => {
                        if (!response.header.success) {
                            toast.result(response);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearDataset());
        }
    }, [dispatch, datasetSeq]);

    useEffect(() => {
        setTemp(storeDataset);
        setError({});
    }, [storeDataset]);

    useEffect(() => {
        const search = { ...defaultSearch, apiCodeId: storeSearch.apiCodeId };
        handleDatasetSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeSearch.apiCodeId]);

    useEffect(() => {
        return () => {
            dispatch(clearDataset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard width={688} className="mr-gutter custom-scroll flex-fill" title={`데이터셋 ${datasetSeq ? '수정' : '등록'}`} loading={loading}>
            <BasicForm
                dataset={temp}
                setDataset={setTemp}
                onClickOpenDataView={handleClickOpenDataView}
                onClickSave={handleClickSave}
                onClickDelete={onDelete}
                onClickCancle={handleClickCancle}
                onClickCopy={handleCopy}
                error={error}
                setError={setError}
                setApi={handleSaveApi}
                makeDataApiUrl={makeDataApiUrl}
            />
            <hr className="divider" />
            <OptionsForm dataset={temp} setDataset={setTemp} error={error} setError={setError} options={options} loading={loading} />
        </MokaCard>
    );
};

export default DatasetEdit;
