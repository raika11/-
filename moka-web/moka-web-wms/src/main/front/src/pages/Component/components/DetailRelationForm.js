import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import copy from 'copy-to-clipboard';
import { MokaInput, MokaInputLabel, MokaInputGroup, MokaIcon, MokaPrependLinkInput } from '@components';
import { notification } from '@utils/toastUtil';

const DetailRelationForm = (props) => {
    const { template, dataType, dataset, inputTag, delWords, skin, matchZone, setTemplate, setDataType, setDataset, setDelWords, setSkin, setMatchZone } = props;

    return (
        <Form>
            {/* 템플릿 */}
            <MokaInputGroup
                className="mb-2"
                label="템플릿"
                as="prependLink"
                inputProps={{
                    to: `/template/${template.templateSeq}`,
                    target: '_blank',
                    linkText: `ID: ${template.templateSeq}`,
                    inputList: [
                        {
                            value: template.tpZone,
                            readOnly: true,
                            disabled: true,
                            style: { width: 175 },
                            className: 'bg-white flex-grow-0',
                        },
                        {
                            value: template.templateName,
                            readOnly: true,
                            disabled: true,
                            className: 'flex-fill bg-white',
                        },
                    ],
                    icon: <MokaIcon iconName="fal-search" />,
                }}
                required
            />
            {/* 데이터셋 */}
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        label="데이터"
                        as="switch"
                        className="mb-0 h-100"
                        inputProps={{
                            id: 'data-type-check',
                            checked: dataType !== 'NONE',
                        }}
                        onChange={(e) => {
                            if (!e.target.checked) {
                                setDataType('NONE');
                            } else {
                                setDataType('DESK');
                            }
                        }}
                    />
                </Col>
                {dataType !== 'NONE' && (
                    <>
                        {/* 데이터셋 > 수동 */}
                        <Col xs={3} className="d-flex p-0 pr-3">
                            <MokaInput
                                className="d-flex align-items-center h-100 flex-grow-0"
                                style={{ width: 100 }}
                                as="radio"
                                name="dataType"
                                inputProps={{ label: '수동', custom: true, id: 'data-type-desk', checked: dataType === 'DESK' }}
                                onChange={() => {
                                    setDataType('DESK');
                                }}
                            />
                            {dataType === 'DESK' && <MokaInput placeholder="ID" value={dataset.datasetSeq} disabled />}
                        </Col>
                        {/* 데이터셋 > 자동 */}
                        <Col xs={6} className="d-flex p-0">
                            <MokaInput
                                className="d-flex align-items-center h-100 flex-grow-0"
                                style={{ width: 70 }}
                                as="radio"
                                name="dataType"
                                inputProps={{ label: '자동', custom: true, id: 'data-type-auto', checked: dataType === 'AUTO' }}
                                onChange={() => {
                                    setDataType('AUTO');
                                }}
                            />
                            {dataType === 'AUTO' && (
                                <MokaPrependLinkInput
                                    to={`/dataset/${dataset.datasetSeq}`}
                                    linkText={`ID: ${dataset.datasetSeq}`}
                                    inputList={{
                                        placeholder: '데이터셋을 선택해주세요',
                                        className: 'bg-white',
                                    }}
                                    icon={<MokaIcon iconName="fal-search" />}
                                />
                            )}
                        </Col>
                    </>
                )}
            </Form.Row>
            {/* 입력태그 */}
            <MokaInputGroup
                label="입력태그"
                value={inputTag}
                className="mb-2"
                append={
                    <Button
                        variant="dark"
                        onClick={() => {
                            copy(inputTag);
                            notification('success', '태그를 복사하였습니다');
                        }}
                    >
                        <MokaIcon iconName="fal-copy" />
                    </Button>
                }
                disabled
            />
            {/* 삭제 단어 */}
            <MokaInputLabel
                label={
                    <>
                        삭제 단어
                        <br />
                        (제목)
                    </>
                }
                as="textarea"
                className="mb-2"
                inputClassName="resize-none"
                inputProps={{ rows: 4 }}
                value={delWords}
                onChange={(e) => {
                    setDelWords(e.target.value);
                }}
            />
            {/* 뷰스킨 */}
            <MokaInputGroup
                className="mb-2"
                label="뷰스킨"
                as="prependLink"
                inputProps={{
                    to: `/skin/${skin.skinSeq}`,
                    target: '_blank',
                    linkText: `ID: ${skin.skinSeq}`,
                    inputList: {
                        value: skin.skinName,
                        readOnly: true,
                        disabled: true,
                        className: 'bg-white',
                    },
                    icon: <MokaIcon iconName="fal-search" />,
                }}
            />
            <MokaInputLabel
                label="영역 설정"
                className="mb-2"
                value={matchZone}
                onChange={(e) => {
                    setMatchZone(e.target.value);
                }}
            />
        </Form>
    );
};

export default DetailRelationForm;
