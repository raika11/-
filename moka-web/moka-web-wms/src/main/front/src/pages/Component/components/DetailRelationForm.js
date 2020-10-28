import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MokaInput, MokaInputLabel, MokaInputGroup, MokaIcon, MokaPrependLinkInput, MokaCopyTextButton } from '@components';
import { TemplateListModal, DatasetListModal, SkinListModal } from '@pages/commons';

const DetailRelationForm = (props) => {
    const {
        template,
        dataType,
        dataset,
        inputTag,
        delWords,
        skin,
        zone,
        matchZone,
        setTemplate,
        setDataType,
        setDataset,
        setDelWords,
        setSkin,
        setZone,
        prevAutoDataset,
        prevDeskDataset,
        invalidList,
    } = props;

    // state
    const [templateModalShow, setTemplateModalShow] = useState(false);
    const [datasetModalShow, setDatasetModalShow] = useState(false);
    const [skinModalShow, setSkinModalShow] = useState(false);
    const [templateError, setTemplateError] = useState(false);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'template') {
                    setTemplateError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <Form>
            {/* 템플릿 */}
            <MokaInputGroup
                className="mb-2"
                label="템플릿"
                as="prependLink"
                inputProps={{
                    to: template.templateSeq ? `/template/${template.templateSeq}` : undefined,
                    linkText: template.templateSeq ? `ID: ${template.templateSeq}` : 'ID',
                    inputList: [
                        {
                            value: template.templateGroupName,
                            disabled: true,
                            style: { width: 175 },
                            className: 'bg-white flex-grow-0',
                            placeholder: '템플릿 위치그룹',
                        },
                        {
                            value: template.templateName,
                            disabled: true,
                            className: 'flex-fill bg-white',
                            placeholder: '템플릿을 선택하세요',
                        },
                    ],
                    icon: <MokaIcon iconName="fal-search" />,
                    onIconClick: () => setTemplateModalShow(true),
                }}
                isInvalid={templateError}
                required
            />
            {/* 데이터셋 */}
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        label="데이터"
                        as="switch"
                        className="mb-0 h-100"
                        id="data-type-check"
                        inputProps={{ checked: dataType !== 'NONE' }}
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
                                id="data-type-desk"
                                name="dataType"
                                inputProps={{ label: '수동', custom: true, checked: dataType === 'DESK' }}
                                onChange={() => {
                                    setDataType('DESK');
                                    if (prevDeskDataset) {
                                        setDataset(prevDeskDataset);
                                    } else {
                                        setDataset({});
                                    }
                                }}
                            />
                            {dataType === 'DESK' && <MokaInput placeholder="ID" value={prevDeskDataset ? prevDeskDataset.datasetSeq : ''} disabled />}
                        </Col>

                        {/* 데이터셋 > 자동 */}
                        <Col xs={6} className="d-flex p-0">
                            <MokaInput
                                className="d-flex align-items-center h-100 flex-grow-0"
                                style={{ width: 70 }}
                                as="radio"
                                id="data-type-auto"
                                name="dataType"
                                inputProps={{ label: '자동', custom: true, checked: dataType === 'AUTO' }}
                                onChange={() => {
                                    setDataType('AUTO');
                                    if (prevAutoDataset) {
                                        setDataset(prevAutoDataset);
                                    } else {
                                        setDataset({});
                                    }
                                }}
                            />
                            {dataType === 'AUTO' && (
                                <MokaPrependLinkInput
                                    to={prevAutoDataset ? `/dataset/${prevAutoDataset.datasetSeq}` : undefined}
                                    linkText={prevAutoDataset ? `ID: ${prevAutoDataset.datasetSeq}` : 'ID'}
                                    inputList={{
                                        placeholder: '데이터셋 선택',
                                        className: 'bg-white',
                                        disabled: true,
                                    }}
                                    icon={<MokaIcon iconName="fal-search" />}
                                    // 아이콘 클릭했을 때 데이터셋 팝업 열고, 데이터셋 선택하면 화면에 보여줌
                                    onIconClick={() => setDatasetModalShow(true)}
                                />
                            )}
                        </Col>
                    </>
                )}
            </Form.Row>
            {/* 입력태그 */}
            <MokaInputGroup label="입력태그" value={inputTag} className="mb-2" append={<MokaCopyTextButton copyText={inputTag} />} disabled />
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
                    to: skin.skinSeq ? `/skin/${skin.skinSeq}` : undefined,
                    linkText: skin.skinSeq ? `ID: ${skin.skinSeq}` : 'ID',
                    inputList: {
                        value: skin.skinName || '',
                        disabled: true,
                        className: 'bg-white',
                        placeholder: '뷰스킨을 선택하세요',
                    },
                    icon: <MokaIcon iconName="fal-search" />,
                    onIconClick: () => setSkinModalShow(true),
                }}
            />
            {/* 매칭영역 설정 */}
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0">
                    <MokaInputLabel label="매칭영역" className="mb-0" value={matchZone} disabled />
                </Col>
                <Col xs={8} className="p-0">
                    <MokaInputLabel
                        label="영역 목록"
                        className="mb-0"
                        value={zone}
                        onChange={(e) => {
                            setZone(e.target.value);
                        }}
                    />
                </Col>
            </Form.Row>

            {/* 템플릿 선택 팝업 */}
            {templateModalShow && (
                <TemplateListModal
                    show={templateModalShow}
                    onHide={() => setTemplateModalShow(false)}
                    onClickSave={(template) => {
                        setTemplate(template);
                        if (template.templateSeq) {
                            setTemplateError(false);
                        }
                    }}
                    selected={template.templateSeq}
                />
            )}

            {/* 데이터셋 선택 팝업 */}
            {datasetModalShow && (
                <DatasetListModal
                    show={datasetModalShow}
                    onHide={() => setDatasetModalShow(false)}
                    onClickSave={(dataset) => {
                        setDataset(dataset);
                    }}
                    selected={dataset.datasetSeq}
                    exclude={[]}
                />
            )}

            {/* 스킨 선택 팝업 */}
            {skinModalShow && (
                <SkinListModal
                    show={skinModalShow}
                    onHide={() => setSkinModalShow(false)}
                    onClickSave={(skin) => {
                        setSkin(skin);
                    }}
                    selected={skin.skinSeq}
                />
            )}
        </Form>
    );
};

export default DetailRelationForm;
