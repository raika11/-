import React, { useEffect, useState, Suspense } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearDataset, getDataset } from '@store/dataset';
import DatasetParameter from '@pages/Dataset/component/DatasetParameter';
import qs from 'qs';
import { DatasetListModal } from '@pages/commons';
import * as datasetAPI from '@store/dataset/datasetApi';

//const DatasetParameter = React.lazy(() => import('./component/DatasetParameter'));
/**
 * 데이터셋 정보/수정 컴포넌트
 */
const DatasetEdit = ({ history }) => {
    const dispatch = useDispatch();
    const { datasetSeq } = useParams();
    const [datasetName, setDatasetName] = useState('');
    const [autoCreateYn, setAutoCreateYn] = useState('N');
    const [description, setDescription] = useState('');
    const [dataApiParam, setDataApiParam] = useState('');
    const [dataApiParamShape, setDataApiParamShape] = useState({});
    const [apiUrl, setApiUrl] = useState('');
    const [autoListModalShow, setAutoListModalShow] = useState(false);

    const { dataset: storeDataset } = useSelector((store) => ({
        dataset: store.dataset.dataset,
    }));

    const handleChangeValue = (event) => {
        const { value, name } = event.target;

        if (name === 'datasetName') {
            setDatasetName(value);
        } else if (name === 'autoCreateYn') {
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
            dataApiParam,
            dataApiParamShape,
        };

        console.log(tmp);
    };

    const handleClickModalSave = async (selectedDataset) => {
        const datasetSeq = selectedDataset.datasetSeq;
        const response = await datasetAPI.getDataset(datasetSeq);
        const { dataApiParam, dataApiParamShape } = response.data.body;
        //console.log(JSON.parse(dataApiParamShape).list[0]);
        setDataApiParam(dataApiParam ? JSON.parse(dataApiParam) : null);
        setDataApiParamShape(dataApiParamShape ? JSON.parse(dataApiParamShape).list[0].parameter : []);
    };

    useEffect(() => {
        if (datasetSeq) {
            dispatch(getDataset(datasetSeq));
        } else {
            dispatch(clearDataset());
        }
    }, [dispatch, datasetSeq]);

    useEffect(() => {
        let datasetName = '';
        let autoCreateYn = 'N';
        let dataApiParam = '';
        let dataApiParamShape = {};
        let description = '';
        let apiUrl = '';

        if (storeDataset.datasetSeq) {
            datasetName = storeDataset.datasetName;
            autoCreateYn = storeDataset.autoCreateYn;
            dataApiParam = storeDataset.dataApiParam;
            dataApiParamShape = storeDataset.dataApiParamShape;
            description = storeDataset.description;
            apiUrl = storeDataset.dataApi;
            if (storeDataset.dataApiParam) {
                apiUrl += `?${qs.stringify(dataApiParam)}`;
            }
        }
        setDatasetName(datasetName);
        setAutoCreateYn(autoCreateYn);
        setDataApiParam(dataApiParam);
        setDataApiParamShape(dataApiParamShape);
        setDescription(description);
        setApiUrl(apiUrl);
    }, [storeDataset]);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" width={688} className="mr-10 custom-scroll flex-fill" title="데이터셋 정보">
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
                        <MokaInputLabel className="mb-0" label="데이터셋명" value={datasetName} onChange={handleChangeValue} placeholder="데이터셋명을 입력하세요" />
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
                            <MokaSearchInput className="w-100" placeholder="데이터를 선택해주세요" value={apiUrl} onSearch={() => setAutoListModalShow(true)} disabled={true} />
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
                                <DatasetParameter dataApiParamShapes={dataApiParamShape} dataApiParam={dataApiParam} onChange={setDataApiParam} />

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

            <DatasetListModal show={autoListModalShow} onHide={() => setAutoListModalShow(false)} onClickSave={handleClickModalSave} />
        </MokaCard>
    );
};

export default DatasetEdit;
