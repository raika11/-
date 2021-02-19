import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';
import CopyModal from '../modals/CopyModal';

const BasicForm = (props) => {
    const { component, setComponent, componentNameRegex, onClickSave, onClickDelete, onClickCancle, error, setError } = props;

    // state
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [copyModalShow, setCopyModalShow] = useState(false);

    useEffect(() => {
        if (!component.componentSeq) {
            setBtnDisabled(true);
        } else {
            setBtnDisabled(false);
        }
    }, [component.componentSeq]);

    return (
        <Form>
            {/* 컴포넌트아이디, 버튼그룹 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel className="mb-0" label="컴포넌트ID" value={component.componentSeq} inputProps={{ plaintext: true, readOnly: true }} />
                </Col>
                <Col xs={6} className="p-0 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="outline-neutral" className="mr-2" onClick={() => setCopyModalShow(true)} disabled={btnDisabled}>
                            설정복사
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="positive" className="mr-2" onClick={onClickSave}>
                            저장
                        </Button>
                        {!btnDisabled && (
                            <Button variant="negative" onClick={onClickDelete} className="mr-2">
                                삭제
                            </Button>
                        )}
                        <Button variant="negative" onClick={onClickCancle}>
                            취소
                        </Button>
                    </div>
                </Col>
            </Form.Row>
            {/* 컴포넌트명 */}
            <Form.Row className="mb-2">
                <Col xs={7} className="p-0">
                    <MokaInputLabel
                        className="mb-0"
                        label="컴포넌트명"
                        placeholder="컴포넌트명을 입력하세요"
                        value={component.componentName}
                        onChange={(e) => {
                            setComponent({
                                ...component,
                                componentName: e.target.value,
                            });
                            if (componentNameRegex.test(e.target.value)) {
                                setError({ ...error, componentName: false });
                            }
                        }}
                        isInvalid={error.componentName}
                        required
                    />
                </Col>
            </Form.Row>
            {/* 컴포넌트명 */}
            <MokaInputLabel
                className="w-100"
                label="설명"
                placeholder="설명을 입력하세요"
                value={component.description}
                onChange={(e) => {
                    setComponent({
                        ...component,
                        description: e.target.value,
                    });
                }}
            />

            {/* 복사 모달 */}
            <CopyModal show={copyModalShow} onHide={() => setCopyModalShow(false)} componentSeq={component.componentSeq} componentName={component.componentName} />
        </Form>
    );
};

export default BasicForm;
