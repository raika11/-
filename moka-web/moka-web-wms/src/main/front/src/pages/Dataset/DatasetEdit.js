import React, { useEffect, useState, Suspense, useCallback } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeDataset, clearDataset, GET_DATASET, getDataset, getDatasetListModal, saveDataset } from '@store/dataset';
import DatasetParameter from '@pages/Dataset/component/DatasetParameter';
import DatasetApiListModal from '@pages/Dataset/modals/DatasetApiListModal';
import qs from 'qs';
import toast from '@utils/toastUtil';
import { API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_CODE_ID, API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID } from '@/constants';
// import CopyDatasetModal from '@pages/Dataset/modals/CopyDatasetModal';
import DefaultInputModal from '@pages/commons/DefaultInputModal';

const defaultSearch = {
    apiCodeId: null,
    searchType: 'datasetSeqLike',
    keyword: '',
    page: 0,
    size: 999,
    sort: 'datasetSeq,desc',
    listType: 'auto',
};

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

    const { dataset: storeDataset, search: storeSearch, loading } = useSelector((store) => ({
        dataset: store.dataset.dataset,
        search: store.dataset.search,
        loading: store.loading[GET_DATASET],
    }));

    const handleChangeValue = (event) => {
        const { value, name } = event.target;
        if (name === 'datasetName') {
            setDatasetName(value);
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
            setAutoCreateYn(value);
        } else if (name === 'description') {
            setDescription(value);
        }
    };

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

        if (tmp.datasetSeq) {
            updateDataset(tmp);
        } else {
            insertDataset(tmp);
        }
    };

    const responseCallback = useCallback(
        (payload) => {
            const { header, body, payload: param } = payload;
            if (header.success) {
                const option = [];
                body.list.map((data) => {
                    option.push({
                        value: '' + data.datasetSeq,
                        label: data.datasetName,
                    });
                });
                setOptions({ ...options, [param.type]: option });
            } else {
            }
        },
        [options],
    );

    /**
     * 검색
     */
    const handleSearch = useCallback(
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

    const handleClickDelete = () => {
        onDelete(storeDataset);
    };

    const handleClickCopy = () => {
        setCopyDatasetModalShow(true);
        console.log('datasetSeq', datasetSeq);
        console.log('datasetName', datasetName);
    };

    const handleClickModalSave = (selectApi) => {
        const parameters = selectApi.parameter;
        let apiParam = null;
        Object.keys(parameters).map((key) => {
            const parameter = parameters[key];
            if (parameter.defaultValue) {
                if (apiParam === null) {
                    apiParam = {};
                }

                apiParam = { ...apiParam, [parameter.name]: parameter.defaultValue };
            }
        });

        setDataApi(selectApi.id);
        setDataApiParam(apiParam);
        setDataApiParamShape(parameters || []);
    };

    const makeDataApiUrl = (dataApi, dataApiParam) => {
        let dataApiUrl = dataApi;
        if (dataApiParam) {
            dataApiUrl += `?${qs.stringify(dataApiParam)}`;
        }

        return dataApiUrl;
    };

    useEffect(() => {
        const search = { ...defaultSearch, apiCodeId: storeSearch.apiCodeId };
        handleSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeSearch.apiCodeId]);

    /**
     * 도메인 수정
     * @param {object} tmp 도메인
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
     * 도메인 등록
     * @param {object} tmp 도메인
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
        callback({ ...data, isInvalid: true });
    };

    useEffect(() => {
        if (paramSeq) {
            dispatch(getDataset(paramSeq));
        } else {
            dispatch(clearDataset());
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
    }, [storeDataset]);

    useEffect(() => {
        setDataApiUrl(makeDataApiUrl(dataApi, dataApiParam));
    }, [dataApi, dataApiParam]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" width={688} className="mr-gutter custom-scroll flex-fill" title="데이터셋 정보">
            <Form>
                {/* 데이터셋아이디, 버튼그룹 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel className="mb-0" label="데이터셋ID" value={datasetSeq} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="p-0 d-flex justify-content-between">
                        <div className="d-flex">
                            <Button variant="dark" className="mr-2" disabled={!datasetSeq && true}>
                                데이터 보기
                            </Button>
                            <Button variant="dark" disabled={!datasetSeq && true} onClick={handleClickCopy}>
                                복사
                            </Button>
                        </div>
                        <div className="d-flex">
                            <Button variant="primary" className="mr-2" onClick={handleClickSave}>
                                저장
                            </Button>
                            {datasetSeq && (
                                <Button variant="danger" onClick={handleClickDelete}>
                                    삭제
                                </Button>
                            )}
                        </div>
                    </Col>
                </Form.Row>
                {/* 데이터셋명 */}
                <Form.Row className="mb-2">
                    <Col xs={7} className="p-0">
                        <MokaInputLabel
                            className="mb-0"
                            label="데이터셋명"
                            name="datasetName"
                            value={datasetName}
                            onChange={handleChangeValue}
                            placeholder="데이터셋명을 입력하세요"
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
                                disabled={true}
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
                                <DatasetParameter dataApiParamShapes={dataApiParamShape} dataApiParam={dataApiParam} onChange={setDataApiParam} options={options} />
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

            <DatasetApiListModal show={datasetApiListModalShow} onHide={() => setDatasetApiListModalShow(false)} onClickSave={handleClickModalSave} />
            <DefaultInputModal
                title="데이타셋 복사"
                inputData={{ title: '데이타셋명', value: datasetName, isInvalid: false }}
                show={copyDatasetModalShow}
                onHide={() => setCopyDatasetModalShow(false)}
                onSave={handleClickCopyModalSave}
            />
        </MokaCard>
    );
};

export default DatasetEdit;
