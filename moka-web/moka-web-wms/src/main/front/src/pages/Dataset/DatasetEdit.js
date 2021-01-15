import React, { useEffect, useState, useCallback } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeDataset, clearDataset, copyDataset, GET_DATASET, getDataset, getDatasetListModal, SAVE_DATASET, saveDataset, DELETE_DATASET } from '@store/dataset';
import DatasetParameter from '@pages/Dataset/component/DatasetParameter';
import DatasetApiListModal from '@pages/Dataset/modals/DatasetApiListModal';
import qs from 'qs';
import toast from '@utils/toastUtil';
import { API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_CODE_ID, API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID, DESKING_API } from '@/constants';
import DefaultInputModal from '@pages/commons/DefaultInputModal';
import { clearStore } from '@store/relation';

const defaultSearch = {
    apiCodeId: null,
    searchType: 'datasetSeqLike',
    keyword: '',
    page: 0,
    size: 999,
    sort: 'datasetSeq,desc',
    listType: 'auto',
};

const defaultInvalid = { datasetName: false, dataApiUrl: false };

//const DatasetParameter = React.lazy(() => import('./component/DatasetParameter'));
/**
 * 데이터셋 정보/수정 컴포넌트
 */
const DatasetEdit = ({ onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { datasetSeq: paramSeq } = useParams();
    const [datasetSeq, setDatasetSeq] = useState('');
    const [datasetName, setDatasetName] = useState('');
    const [autoCreateYn, setAutoCreateYn] = useState('N');
    const [description, setDescription] = useState('');
    const [dataApi, setDataApi] = useState('');
    const [dataApiParam, setDataApiParam] = useState('');
    const [dataApiParamShape, setDataApiParamShape] = useState({});
    const [dataApiUrl, setDataApiUrl] = useState('');
    const [datasetApiListModalShow, setDatasetApiListModalShow] = useState(false);
    const [copyDatasetModalShow, setCopyDatasetModalShow] = useState(false);
    const [options, setOptions] = useState({
        [API_PARAM_HINT_DATASET_SEQ]: [],
        [API_PARAM_HINT_BUSE_ID]: [],
        [API_PARAM_HINT_GIJA_ID]: [],
        [API_PARAM_HINT_SERIES_ID]: [],
        [API_PARAM_HINT_CODE_ID]: [],
    });
    const [invalid, setInvalid] = useState(defaultInvalid);

    const { dataset: storeDataset, search: storeSearch, loading } = useSelector(
        (store) => ({
            dataset: store.dataset.dataset,
            search: store.dataset.search,
            loading: store.loading[GET_DATASET] || store.loading[SAVE_DATASET] || store.loading[DELETE_DATASET],
        }),
        shallowEqual,
    );

    /**
     * 값 변경 이벤트
     * @param {Object} event javascript event
     */
    const handleChangeValue = (event) => {
        const { value, name } = event.target;
        if (name === 'datasetName') {
            setDatasetName(value);
            setInvalid({ ...invalid, datasetName: false });
        } else if (name === 'autoCreateYn') {
            if (value === 'Y') {
                setDataApi(storeDataset.dataApi || '');
                setDataApiParam(storeDataset.dataApiParam || '');
                setDataApiParamShape(storeDataset.dataApiParamShape || {});
                setDescription(storeDataset.description || '');
                setDataApiUrl(makeDataApiUrl(storeDataset.dataApi, storeDataset.dataApiParam) || '');
            } else {
                setDataApi('');
                setDataApiParam('');
                setDataApiParamShape({});
                setDescription('');
                setDataApiUrl('');
            }
            setInvalid({ ...invalid, dataApiUrl: false });
            setAutoCreateYn(value);
        } else if (name === 'description') {
            setDescription(value);
        }
    };

    /**
     * validation check
     * @param tmp 등록/수정 dataset
     * @returns {boolean} validate 여부
     */
    const validate = (tmp) => {
        let invalidated = { ...invalid };
        let isInvalid = false;

        if (!tmp.datasetName || tmp.datasetName === '') {
            invalidated = { ...invalidated, datasetName: true };
        }

        if (tmp.autoCreateYn === 'Y' && (!dataApiUrl || dataApiUrl === '')) {
            invalidated = { ...invalidated, dataApiUrl: true };
        }

        for (const key of Object.keys(dataApiParamShape)) {
            const param = dataApiParamShape[key];
            if (param.require) {
                if (dataApiParam && dataApiParam[param.name]) {
                    if (param.filter) {
                        const regex = new RegExp(param.filter);
                        if (!regex.test(dataApiParam[param.name])) {
                            invalidated = { ...invalidated, [param.name]: true };
                        }
                    }
                } else {
                    invalidated = { ...invalidated, [param.name]: true };
                }
                //if (!dataApiParam || !dataApiParam[param.name])
            }
        }

        for (const value of Object.values(invalidated)) {
            isInvalid = isInvalid | value;
        }

        setInvalid(invalidated);

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
            datasetName,
            autoCreateYn,
            dataApi,
            dataApiParam: dataApiParam === '' ? dataApiParam : JSON.stringify(dataApiParam),
            apiCodeId: storeSearch.apiCodeId,
            description,
            dataApiParamShape: null,
        };

        if (validate(tmp)) {
            if (tmp.datasetSeq) {
                updateDataset(tmp);
            } else {
                insertDataset(tmp);
            }
        }
    };

    const responseCallback = useCallback(
        /**
         * 자동완성 데이터를 넣어주기 위한 callback 함수
         * @param payload 조회한 데이터에 대한 결과 값
         */
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

    const handleDatasetSearch = useCallback(
        /**
         * 자동완성 데이타셋 데이터 조회
         * @param search 검색 값
         */
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
     * 삭제 이벤트 핸들러
     */
    const handleClickDelete = () => {
        onDelete(storeDataset);
    };

    /**
     * 복사 이벤트 핸들러
     */
    const handleClickCopy = () => {
        setCopyDatasetModalShow(true);
    };

    /**
     * dataApiListPopup 저장 이벤트 핸들러
     * @param {Object} selectApi 선택한 API
     * @param {function} hideCallback 숨김 함수
     */
    const handleClickDatasetListModalSave = (selectApi, hideCallback) => {
        const parameters = selectApi.parameter;
        if (parameters) {
            setInvalid({ ...invalid, dataApiUrl: false });
            let apiParam = null;
            for (const key of Object.keys(parameters)) {
                const parameter = parameters[key];
                if (parameter.defaultValue) {
                    if (apiParam === null) {
                        apiParam = {};
                    }

                    apiParam = { ...apiParam, [parameter.name]: parameter.defaultValue };
                }
            }

            setDataApi(selectApi.id);
            setDataApiParam(apiParam);
            setDataApiParamShape(parameters || []);
            hideCallback();
        } else {
            toast.warning('하나 이상의 자동 데이타셋을 선택해 주세요.');
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
            dataApiUrl += `?${qs.stringify(dataApiParam)}`;
        }

        return dataApiUrl;
    };

    /**
     *데이터셋 관리 수정
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
                callback: (response) => {
                    // 만약 response.header.message로 서버 메세지를 전달해준다면, 그 메세지를 보여준다.
                    toast.result(response);
                },
            }),
        );
    };

    /**
     * 더이터셋 등록
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
                        history.push(`/dataset/${response.body.datasetSeq}`);
                    }
                },
            }),
        );
    };

    /**
     * Copy 팝업 저장
     * @param {object} data 정보
     * @param callback 저장시 동작할 callback 함수
     */
    const handleClickCopyModalSave = (data, callback) => {
        if (data.value) {
            dispatch(
                copyDataset({
                    datasetSeq,
                    datasetName: data.value,
                    callback: (response) => {
                        const { header, body } = response;
                        toast.result(response);
                        if (header.success) {
                            setCopyDatasetModalShow(false);
                            history.push(`/dataset/${body.datasetSeq}`);
                        }
                    },
                }),
            );
        } else {
            callback(true);
        }
    };

    /**
     * 데이터보기 클릭 이벤트
     * @param {object} e javascript event
     */
    const handleClickOpenDataView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let url = `${storeDataset.dataApiHost}/${storeDataset.dataApiPath}/`;
        if (autoCreateYn === 'Y') {
            url += `${dataApi}?${qs.stringify(dataApiParam)}`;
        } else {
            url += DESKING_API + datasetSeq;
        }

        window.open(url);
    };

    useEffect(() => {
        if (paramSeq) {
            dispatch(
                getDataset({
                    datasetSeq: paramSeq,
                    callback: (response) => {
                        if (!response.header.success) {
                            toast.result(response);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearDataset());
            dispatch(clearStore());
        }
    }, [dispatch, paramSeq]);

    useEffect(() => {
        setDatasetSeq(storeDataset.datasetSeq || '');
        setDatasetName(storeDataset.datasetName || '');
        setAutoCreateYn(storeDataset.autoCreateYn || 'N');
        setDataApi(storeDataset.dataApi || '');
        setDataApiParam(storeDataset.dataApiParam || '');
        setDataApiParamShape(storeDataset.dataApiParamShape || {});
        setDescription(storeDataset.description || '');
        setDataApiUrl(makeDataApiUrl(storeDataset.dataApi, storeDataset.dataApiParam) || '');
        setInvalid(defaultInvalid);
    }, [storeDataset]);

    useEffect(() => {
        setDataApiUrl(makeDataApiUrl(dataApi, dataApiParam));
    }, [dataApi, dataApiParam]);

    useEffect(() => {
        const search = { ...defaultSearch, apiCodeId: storeSearch.apiCodeId };
        handleDatasetSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeSearch.apiCodeId]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" width={688} className="mr-gutter custom-scroll flex-fill" title="데이터셋 정보" loading={loading}>
            <Form>
                {/* 데이터셋아이디, 버튼그룹 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel className="mb-0" label="데이터셋ID" value={datasetSeq} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="p-0 d-flex justify-content-between">
                        <div className="d-flex">
                            <Button variant="outline-neutral" className="mr-2" disabled={!datasetSeq && true} onClick={handleClickOpenDataView}>
                                데이터 보기
                            </Button>
                            <Button variant="outline-neutral" disabled={!datasetSeq && true} onClick={handleClickCopy}>
                                복사
                            </Button>
                        </div>
                        <div className="d-flex">
                            <Button variant="positive" className="mr-2" onClick={handleClickSave}>
                                저장
                            </Button>
                            {datasetSeq && (
                                <Button variant="negative" onClick={handleClickDelete}>
                                    삭제
                                </Button>
                            )}
                        </div>
                    </Col>
                </Form.Row>
                {/* 데이터셋명 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="데이터셋명"
                            name="datasetName"
                            value={datasetName}
                            onChange={handleChangeValue}
                            placeholder="데이터셋명을 입력하세요"
                            required
                            isInvalid={invalid['datasetName']}
                        />
                    </Col>
                </Form.Row>
                {/* 데이터타입 */}
                <Form.Row className="mb-2">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="radio"
                            className="mb-0 h-100"
                            label="데이터"
                            value="N"
                            id="dataset-type1"
                            inputProps={{ custom: true, label: '수동', checked: autoCreateYn === 'N' }}
                            onChange={handleChangeValue}
                            name="autoCreateYn"
                        />
                    </Col>
                    <Col xs={1} className="p-0 mr-10">
                        <MokaInput
                            as="radio"
                            className="mb-0 h-100 align-items-center d-flex"
                            value="Y"
                            id="dataset-type2"
                            inputProps={{ custom: true, label: '자동', checked: autoCreateYn === 'Y' }}
                            onChange={handleChangeValue}
                            name="autoCreateYn"
                        />
                    </Col>
                    <Col xs={5} className="p-0 d-flex">
                        {autoCreateYn === 'Y' && (
                            <MokaSearchInput
                                className="w-100"
                                placeholder="데이터를 선택해주세요"
                                value={decodeURIComponent(dataApiUrl)}
                                onSearch={() => setDatasetApiListModalShow(true)}
                                isInvalid={invalid['dataApiUrl']}
                                inputProps={{ readOnly: true }}
                            />
                        )}
                    </Col>
                </Form.Row>
            </Form>

            <hr className="divider" />

            <Card.Title className="mb-2">데이터 설정</Card.Title>
            <div className="d-flex justify-content-center">
                <Col xs={10} className="p-0">
                    <Form>
                        {/* 데이터셋의 파라미터에 따라 변경됨 */}
                        {autoCreateYn === 'Y' && dataApiParamShape && (
                            <>
                                <DatasetParameter
                                    dataApiParamShapes={dataApiParamShape}
                                    dataApiParam={dataApiParam}
                                    onChange={setDataApiParam}
                                    options={options}
                                    isInvalid={invalid}
                                    onChangeValid={setInvalid}
                                />
                            </>
                        )}
                        <MokaInputLabel
                            label="설명"
                            as="textarea"
                            name="description"
                            labelWidth={80}
                            className="mb-0"
                            inputClassName="resize-none"
                            inputProps={{ rows: 7 }}
                            value={description}
                            onChange={handleChangeValue}
                        />
                    </Form>
                </Col>
            </div>

            <DatasetApiListModal show={datasetApiListModalShow} onHide={() => setDatasetApiListModalShow(false)} onClickSave={handleClickDatasetListModalSave} />
            <DefaultInputModal
                title="데이타셋 복사"
                inputData={{ title: '데이타셋명', value: `${datasetName}_복사`, isInvalid: false }}
                show={copyDatasetModalShow}
                onHide={() => setCopyDatasetModalShow(false)}
                onSave={handleClickCopyModalSave}
            />
        </MokaCard>
    );
};

export default DatasetEdit;
