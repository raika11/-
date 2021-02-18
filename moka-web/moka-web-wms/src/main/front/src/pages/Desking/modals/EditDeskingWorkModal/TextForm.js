import React from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import { unescapeHtmlArticle } from '@utils/convertUtil';

/**
 * deskingPartMapping에서 text 형식의 기본 리스트
 * 링크는 타겟 셀렉트 박스 자동 생성
 * 링크타겟을 받는 DTO 필드는 ~Target으로 고정
 *
 * +)
 * unescape === true 이면 unescapeHtmlArticle 처리
 */
const TextForm = ({ mappingData, urlRegex, temp, onChange, error, unescape = false }) => {
    const { as, field, label, errorCheck, ...mappingProps } = mappingData;
    const isUrl = urlRegex.test(field);
    const urlTarget = isUrl ? `${field.replace('Url', '')}Target` : '';

    return (
        <Form.Row className="mb-2">
            <Col xs={isUrl ? 10 : 12} className={clsx('p-0', { 'pr-2': isUrl })}>
                <MokaInputLabel
                    as={as}
                    label={label}
                    labelClassName="pr-3"
                    name={field}
                    className="mb-0 w-100"
                    value={unescape ? unescapeHtmlArticle(temp[field]) : temp[field]}
                    onChange={onChange}
                    isInvalid={errorCheck && error[field]}
                    {...mappingProps}
                />
            </Col>
            {isUrl && (
                <Col xs={2} className="p-0">
                    <MokaInput as="select" name={urlTarget} value={temp[urlTarget] || '_self'} onChange={onChange}>
                        <option value="_self">본창</option>
                        <option value="_blank">새창</option>
                    </MokaInput>
                </Col>
            )}
        </Form.Row>
    );
};

export default TextForm;
