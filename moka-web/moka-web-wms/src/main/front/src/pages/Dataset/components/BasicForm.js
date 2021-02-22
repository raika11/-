import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaSearchInput } from '@components';
import DatasetApiListModal from '../modals/DatasetApiListModal';
import DefaultInputModal from '@pages/commons/DefaultInputModal';

const BasicForm = (props) => {
    const { dataset, setDataset, onClickOpenDataView, onClickSave, onClickCancle, onClickDelete, error, setError, onClickCopy, setApi, makeDataApiUrl } = props;
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [apiModalShow, setApiModalShow] = useState(false);
    const [copyModelShow, setCopyModalShow] = useState(false);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'datasetName') {
            setError({ ...error, datasetName: false });
        }
        setDataset({ ...dataset, [name]: value });
    };

    useEffect(() => {
        if (dataset?.datasetSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [dataset.datasetSeq]);

    return (
        <Form>
            {/* 데이터셋아이디, 버튼그룹 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel className="mb-0" label="데이터셋ID" value={dataset.datasetSeq} inputProps={{ plaintext: true, readOnly: true }} />
                </Col>
                <Col xs={6} className="p-0 d-flex justify-content-between">
                    <div className="d-flex">
                        {dataset.autoCreateYn === 'Y' && (
                            <Button variant="outline-neutral" className="mr-1" disabled={btnDisabled} onClick={() => setCopyModalShow(true)}>
                                복사
                            </Button>
                        )}
                        <Button variant="outline-neutral" disabled={btnDisabled} onClick={onClickOpenDataView}>
                            데이터 보기
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="positive mr-1" onClick={onClickSave}>
                            {btnDisabled ? '저장' : '수정'}
                        </Button>
                        {dataset.autoCreateYn === 'Y' && dataset.datasetSeq && (
                            <Button variant="negative" className="mr-1" onClick={() => onClickDelete(dataset)}>
                                삭제
                            </Button>
                        )}
                        <Button variant="negative" onClick={onClickCancle}>
                            취소
                        </Button>
                    </div>
                </Col>
            </Form.Row>
            {/* 데이터셋명 */}
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0">
                    <MokaInputLabel
                        label="데이터셋명"
                        name="datasetName"
                        value={dataset.datasetName}
                        onChange={handleChangeValue}
                        placeholder="데이터셋명을 입력하세요"
                        required
                        isInvalid={error.datasetName}
                    />
                </Col>
            </Form.Row>
            {/* 데이터 타입 */}
            <Form.Row>
                <Col xs={12} className="p-0">
                    {dataset.autoCreateYn === 'N' && <MokaInputLabel label="데이터" value="편집" inputProps={{ plaintext: true, readOnly: true }} />}
                    {dataset.autoCreateYn === 'Y' && (
                        <Form.Row>
                            <Col xs={3} className="p-0">
                                <MokaInputLabel label="데이터" value="자동" inputProps={{ plaintext: true, readOnly: true }} />
                            </Col>
                            <Col xs={9} className="p-0">
                                <MokaSearchInput
                                    className="flex-fill"
                                    placeholder="데이터를 선택해주세요"
                                    value={decodeURIComponent(makeDataApiUrl(dataset.dataApi, dataset.dataApiParam) || '')}
                                    onSearch={() => setApiModalShow(true)}
                                    isInvalid={error.dataApiUrl}
                                    inputProps={{ readOnly: true }}
                                />
                            </Col>
                        </Form.Row>
                    )}
                </Col>
            </Form.Row>

            {/* API 모달 */}
            <DatasetApiListModal show={apiModalShow} onHide={() => setApiModalShow(false)} onClickSave={setApi} />

            {/* 복사 모달 */}
            <DefaultInputModal
                title="데이타셋 복사"
                inputData={{ title: '데이타셋명', value: `${dataset.datasetName}_복사`, isInvalid: false }}
                show={copyModelShow}
                onHide={() => setCopyModalShow(false)}
                onSave={onClickCopy}
                centered
            />
        </Form>
    );
};

export default BasicForm;
