import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';

const BasicForm = (props) => {
    const { componentSeq, componentName, description, setComponentName, setDescription, onClickSave, onClickCopy, onClickDelete, invalidList } = props;
    const [componentNameError, setComponentNameError] = useState(false);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'componentName') {
                    setComponentNameError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <Form>
            {/* 컴포넌트아이디, 버튼그룹 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel className="mb-0" label="컴포넌트ID" value={componentSeq} inputProps={{ plaintext: true, readOnly: true }} />
                </Col>
                <Col xs={6} className="p-0 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="dark" className="mr-2" onClick={onClickCopy}>
                            설정복사
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="primary" className="mr-2" onClick={onClickSave}>
                            저장
                        </Button>
                        <Button variant="danger" onClick={onClickDelete}>
                            삭제
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
                        value={componentName}
                        onChange={(e) => {
                            setComponentName(e.target.value);
                        }}
                        isInvalid={componentNameError}
                        required
                    />
                </Col>
            </Form.Row>
            {/* 컴포넌트명 */}
            <MokaInputLabel
                className="mb-2 w-100"
                label="설명"
                placeholder="설명을 입력하세요"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            />
        </Form>
    );
};

export default BasicForm;
