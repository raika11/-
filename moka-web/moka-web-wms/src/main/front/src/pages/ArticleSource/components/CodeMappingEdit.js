import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { CodeAutocomplete } from '@/pages/commons';
import toast from '@utils/toastUtil';
import { getMappingCodeDuplicateCheck, saveMappingCode, deleteMappingCode } from '@store/articleSource';

const CodeMappingEdit = (props) => {
    const { data, mappingCode, onHide } = props;
    const dispatch = useDispatch();
    // local state
    const [temp, setTemp] = useState({});
    const [disabledInput, setDisabledInput] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [hiddenBtn, setHiddenBtn] = useState('');

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

    const handleClickCancel = () => {
        onHide();
    };

    useEffect(() => {
        if (mappingCode.seqNo) {
            setDisabledInput(true);
            setHiddenBtn('hidden');
            setTemp(mappingCode);
        } else {
            setDisabledInput(false);
            setHiddenBtn('');
            setTemp({});
        }
    }, [mappingCode]);

    return (
        <div className="pt-3 d-flex flex-column align-items-center">
            <p>변환 코드 추가: (대소문자 구분합니다)</p>
            <Form.Row>
                <Col xs={8} className="p-0">
                    <MokaInputLabel
                        label="매체 분류 코드"
                        labelWidth={80}
                        labelClassName="ft-12"
                        inputClassName="ft-12"
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
                <Col xs={3} className="p-0">
                    <Button variant="outline-table-btn" onClick={checkDuplicatedMappingCode} disabled={disabledBtn} style={{ visibility: hiddenBtn }}>
                        중복 확인
                    </Button>
                </Col>
            </Form.Row>
            <p className="mb-0 ft-12">소분류 코드로 입력해주세요,</p>
            <p className="mb-5 ft-12">마땅한게 없으면 XX 일반코드로(사회일반, 정치일반 등)</p>
            <div style={{ width: 400 }}>
                <CodeAutocomplete
                    label="분류 코드"
                    labelWidth={50}
                    labelClassName="ft-12"
                    name="masterCode"
                    placeholder="분류 선택"
                    value={temp.toCode}
                    onChange={(value) => setTemp({ ...temp, toCode: value })}
                />
            </div>
            {!temp.seqNo && (
                <div className="d-flex mt-5">
                    <Button className="mr-2" variant="positive" onClick={handleClickSave}>
                        등록
                    </Button>
                    <Button variant="negative" onClick={handleClickCancel}>
                        취소
                    </Button>
                </div>
            )}
            {temp.seqNo && (
                <div className="d-flex mt-5">
                    <Button className="mr-2" variant="positive" onClick={handleClickSave}>
                        수정
                    </Button>
                    <Button className="mr-2" variant="negative" onClick={handleClickCancel}>
                        취소
                    </Button>
                    <Button variant="negative" onClick={handleClickDelete}>
                        삭제
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CodeMappingEdit;
