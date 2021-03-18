import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaCard } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import toast from '@utils/toastUtil';
import { getMappingCodeDuplicateCheck, saveMappingCode, deleteMappingCode } from '@store/articleSource';

const CodeMappingEdit = (props) => {
    const { data, mappingCode, onHide } = props;
    const dispatch = useDispatch();
    // local state
    const [temp, setTemp] = useState({});
    const [disabledInput, setDisabledInput] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(false);

    /**
     * 매핑코드의 중복체크
     */
    const checkDuplicatedMappingCode = () => {
        dispatch(
            getMappingCodeDuplicateCheck({
                sourceCode: data.sourceCode,
                frCode: temp.frCode,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 중복 없음
                        if (!body) {
                            toast.success('사용할 수 있는 코드입니다.');
                            setDisabledBtn(true);
                        }
                        // 중복 있음
                        else {
                            toast.fail(header.message);
                        }
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    const handleClickSave = () => {
        let saveTemp = { ...temp, sourceCode: data.sourceCode, articleSource: { sourceCode: data.sourceCode, sourceName: data.sourceName } };
        if (Number(temp.toCode.substr(temp.toCode.length - 1)) > 0) {
            dispatch(
                saveMappingCode({
                    mappingCode: saveTemp,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else if (!temp.toCode) {
            toast.warning('분류 코드를 선택하세요');
        } else if (temp.toCode.substr(temp.toCode.length - 1) === '0') {
            toast.warning('분류 코드는 소분류를 선택하세요');
        }
    };

    const handleClickDelete = () => {
        dispatch(
            deleteMappingCode({
                sourceCode: data.sourceCode,
                seqNo: temp.seqNo,
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    const handleClickCancle = () => {
        onHide();
    };

    useEffect(() => {
        if (mappingCode.seqNo) {
            setDisabledInput(true);
            setTemp(mappingCode);
        } else {
            setDisabledInput(false);
            setTemp({});
        }
    }, [mappingCode]);

    return (
        <MokaCard
            header={false}
            className="h-100 w-100 shadow-none"
            bodyClassName="d-flex flex-column"
            footer
            footerButtons={[
                { text: temp.seqNo ? '수정' : '저장', onClick: handleClickSave, variant: 'positive', className: 'mr-1' },
                temp.seqNo && { text: '삭제', onClick: handleClickDelete, variant: 'negative', className: 'mr-1' },
                { text: '취소', onClick: handleClickCancle, variant: 'negative' },
            ].filter(Boolean)}
        >
            <p className="mb-2" style={{ marginLeft: 90 }}>
                변환 코드 추가: (대소문자 구분합니다)
            </p>
            <Form.Row className="mb-2">
                <Col xs={mappingCode.seqNo ? 11 : 8} className="p-0">
                    <MokaInputLabel
                        label="매체 분류 코드"
                        labelWidth={80}
                        className="mr-2"
                        value={temp.frCode}
                        onChange={(e) => {
                            setTemp({ ...temp, frCode: e.target.value });

                            if (temp.frCode !== e.target.value) {
                                setDisabledBtn(false);
                            }
                        }}
                        disabled={disabledInput}
                    />
                </Col>
                {!mappingCode.seqNo && (
                    <Col xs={4} className="p-0">
                        <Button variant="outline-table-btn" onClick={checkDuplicatedMappingCode} disabled={disabledBtn}>
                            중복 확인
                        </Button>
                    </Col>
                )}
            </Form.Row>
            <p className="mb-2" style={{ marginLeft: 90 }}>
                소분류 코드로 입력해주세요, <br />
                마땅한게 없으면 XX 일반코드로(사회일반, 정치일반 등)
            </p>
            <div style={{ width: 354 }}>
                <CodeAutocomplete
                    label="분류 코드"
                    labelWidth={80}
                    name="masterCode"
                    placeholder="분류 선택"
                    value={temp.toCode}
                    onChange={(value) => setTemp({ ...temp, toCode: value })}
                />
            </div>
        </MokaCard>
    );
};

export default CodeMappingEdit;
