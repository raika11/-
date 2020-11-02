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
import { notification } from '@utils/toastUtil';
import { API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_CODE_ID, API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID } from '@/constants';
import { changeDomain, duplicateCheck, saveDomain } from '@store/domain';

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
const DatasetEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { datasetSeq } = useParams();
    const [datasetName, setDatasetName] = useState('');
    const [autoCreateYn, setAutoCreateYn] = useState('N');
    const [description, setDescription] = useState('');
    const [dataApi, setDataApi] = useState('');
    const [dataApiParam, setDataApiParam] = useState('');
    const [dataApiParamShape, setDataApiParamShape] = useState({});
    const [dataApiUrl, setDataApiUrl] = useState('');
    const [autoListModalShow, setAutoListModalShow] = useState(false);
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

    const responseCallback = (payload) => {
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
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(
        (search) => {
            if (options[API_PARAM_HINT_DATASET_SEQ].length === 0) {
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

    useEffect(() => {
        const search = { ...defaultSearch, apiCodeId: storeSearch.apiCodeId };
        handleSearch(defaultSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeSearch.apiCodeId]);

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
                    if (response.header.success) {
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
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
                        if (response.header.success) {
                            notification('success', '등록하였습니다.');
                            history.push(`/dataset/${response.body.datasetSeq}`);
                        } else {
                            notification('warning', '실패하였습니다.');
                        }
                    },
                }),
            ),
        );
    };

    useEffect(() => {
        if (datasetSeq) {
            dispatch(getDataset(datasetSeq));
        } else {
            dispatch(clearDataset());
        }
    }, [dispatch, datasetSeq]);

    useEffect(() => {
        /*let datasetName = '';
        let autoCreateYn = 'N';
        let dataApi = '';
        let dataApiParam = '';
        let dataApiParamShape = {};
        let description = '';
        let dataApiUrl = '';
        let apiCodeId = storeSearch.apiCodeId;

        if (storeDataset.autoCreateYn === 'Y') {
            datasetName = storeDataset.datasetName;
            autoCreateYn = storeDataset.autoCreateYn;
            dataApiParam = storeDataset.dataApiParam;
            dataApiParamShape = storeDataset.dataApiParamShape;
            description = storeDataset.description;
            dataApi = storeDataset.dataApi;
            dataApiUrl = makeDataApiUrl(dataApi, dataApiParam);
        }
        setDatasetName(datasetName);
        setAutoCreateYn(autoCreateYn);
        setDataApi(dataApi);
        setDataApiParam(dataApiParam);
        setDataApiParamShape(dataApiParamShape);
        setDescription(description);
        setDataApiUrl(dataApiUrl);
        setDataApiCode(apiCodeId);*/

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
                        <MokaInputLabel className="mb-0" label="데이터셋ID" value={storeDataset.datasetSeq || ''} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="p-0 d-flex justify-content-between">
                        <div className="d-flex">
                            <Button variant="dark" className="mr-2">
                                데이터 보기
                            </Button>
                            <Button variant="dark">복사</Button>
                        </div>
                        <div className="d-flex">
                            <Button variant="primary" className="mr-2" onClick={handleClickSave}>
                                저장
                            </Button>
                            <Button variant="danger">삭제</Button>
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
                                onSearch={() => setAutoListModalShow(true)}
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

                                {/*<Form.Row className="mb-2">
                                    <MokaInputLabel label="데이터셋 ID" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="부서" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="분류" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="기자" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="시리즈" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="지역" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>*/}
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

            <DatasetApiListModal show={autoListModalShow} onHide={() => setAutoListModalShow(false)} onClickSave={handleClickModalSave} />
        </MokaCard>
    );
};

export default DatasetEdit;
