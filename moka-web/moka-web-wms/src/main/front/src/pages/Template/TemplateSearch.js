import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';
import { getTemplateList, changeSearchOption } from '@store/template/templateAction';

/**
 * 템플릿 검색 컴포넌트
 */
const TemplateSearch = () => {
    const dispatch = useDispatch();
    const { latestDomainId, domainList, search } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
        search: store.template.search,
    }));

    useEffect(() => {
        dispatch(
            changeSearchOption({
                key: 'domainId',
                value: latestDomainId,
            }),
        );
    }, [dispatch, latestDomainId]);

    return (
        <Form className="mb-10">
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
                    className="w-100"
                    value={search.domainId}
                    onChange={(e) => {
                        dispatch(changeSearchOption({ key: 'domainId', value: e.target.value }));
                    }}
                >
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form.Row>
            <Form.Group as={Row} className="mb-2">
                <Col xs={7} className="p-0 pr-2">
                    <Form.Control as="select" custom>
                        <option>템플릿 위치그룹</option>
                    </Form.Control>
                </Col>
                <Col xs={5} className="p-0">
                    <Form.Control as="select" custom>
                        <option>템플릿 사이즈</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <Form.Control as="select" custom>
                        <option>템플릿 검색조건</option>
                    </Form.Control>
                </Col>
                <Col xs={8} className="p-0">
                    <MokaSearchInput />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default TemplateSearch;
