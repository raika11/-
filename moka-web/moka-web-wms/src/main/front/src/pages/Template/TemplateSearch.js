import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { getTemplateList, changeSearchOption } from '@store/template/templateAction';

const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' },
    { id: 'templateBody', name: '템플릿본문' },
];

/**
 * 템플릿 검색 컴포넌트
 */
const TemplateSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList, search } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
        search: store.template.search,
    }));

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(getTemplateList(changeSearchOption({ key: 'page', value: 0 })));
    }, [dispatch]);

    useEffect(() => {
        // latestDomainId 변경 => 템플릿의 search.domainId 변경
        dispatch(
            changeSearchOption({
                key: 'domainId',
                value: latestDomainId,
            }),
        );
    }, [dispatch, latestDomainId]);

    useEffect(() => {
        // 템플릿 리스트 조회
        if (search.domainId) {
            handleSearch();
        }
    }, [search.domainId, handleSearch]);

    return (
        <Form className="mb-10">
            {/* 도메인 선택 */}
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
                    className="w-100"
                    value={search.domainId || undefined}
                    onChange={(e) => {
                        dispatch(changeLatestDomainId(e.target.value));
                        history.push('/template');
                    }}
                >
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form.Row>
            <Form.Row className="mb-2">
                {/* 템플릿 위치그룹 */}
                <Col xs={7} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        value={search.templateGroup || undefined}
                        onChange={(e) => {
                            dispatch(changeSearchOption({ key: 'templateGroup', value: e.target.value }));
                        }}
                    >
                        <option>위치그룹(기타코드)</option>
                    </MokaInput>
                </Col>
                {/* 템플릿 사이즈 */}
                <Col xs={5} className="p-0">
                    <MokaInput
                        as="select"
                        value={search.templateWidth || undefined}
                        onChange={(e) => {
                            dispatch(changeSearchOption({ key: 'templateWidth', value: e.target.value }));
                        }}
                    >
                        <option>템플릿사이즈(기타코드)</option>
                    </MokaInput>
                </Col>
            </Form.Row>
            <Form.Group as={Row} className="mb-2">
                {/* 검색조건 */}
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        value={search.searchType || undefined}
                        onChange={(e) => {
                            dispatch(changeSearchOption({ key: 'searchType', value: e.target.value }));
                        }}
                    >
                        {defaultSearchType.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                {/* 키워드 */}
                <Col xs={8} className="p-0">
                    <MokaSearchInput
                        value={search.keyword}
                        onChange={(e) => {
                            dispatch(changeSearchOption({ key: 'keyword', value: e.target.value }));
                        }}
                        onSearch={handleSearch}
                    />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default TemplateSearch;
