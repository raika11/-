import React from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaInput, MokaIcon } from '@components';

const ParamDesc = ({ className, onChange, onDelete, onAdd, index, validateParamName, isInvalid, ...data }) => {
    return (
        <Form.Row className={clsx('d-flex align-items-center', className)}>
            {/* 파라미터명 */}
            <Col xs={4} className="p-0 pr-2">
                <MokaInputLabel
                    label={index === 0 ? '파라미터' : ' '}
                    placeholder="파라미터명"
                    name="name"
                    value={data.name}
                    onChange={(e) => onChange(e, index)}
                    isInvalid={isInvalid}
                    inputProps={{ onBlur: (e) => validateParamName(e, index) }}
                />
            </Col>

            {/* 파라미터 설명 */}
            <Col xs={4} className="p-0 pr-2">
                <MokaInput placeholder="파라미터 설명" name="desc" value={data.desc} onChange={(e) => onChange(e, index)} />
            </Col>

            <Col xs={4} className="p-0 d-flex">
                {/* 필수 여부 */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="required" value={data.required || 'N'} onChange={(e) => onChange(e, index)}>
                        <option value="N">선택</option>
                        <option value="Y">필수</option>
                    </MokaInput>
                </div>

                {/* 데이터타입 */}
                <MokaInput as="select" className="mr-2" name="dataType" value={data.dataType || 'string'} onChange={(e) => onChange(e, index)}>
                    <option value="string">string</option>
                    <option value="integer">integer</option>
                    <option value="long">long</option>
                    <option value="Arrag[string]">Array[string]</option>
                    <option value="date-time">date-time</option>
                    <option value="file">file</option>
                </MokaInput>

                {/* 추가/삭제 버튼 */}
                <div className="flex-shrink-0">
                    {index === 0 ? (
                        <Button variant="outline-positive" onClick={onAdd}>
                            <MokaIcon iconName="fal-plus" />
                        </Button>
                    ) : (
                        <Button variant="outline-negative" onClick={() => onDelete(index)}>
                            <MokaIcon iconName="fal-minus" />
                        </Button>
                    )}
                </div>
            </Col>
        </Form.Row>
    );
};

export default ParamDesc;
