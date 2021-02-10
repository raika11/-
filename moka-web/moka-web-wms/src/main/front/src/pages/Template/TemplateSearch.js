import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { getTemplateList, changeSearchOption, initialState } from '@store/template';
import { getTpSize, getTpZone } from '@store/codeMgt';

/**
 * 템플릿 검색 컴포넌트
 */
const TemplateSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList, search: storeSearch, tpSizeRows, tpZoneRows } = useSelector(
        (store) => ({
            latestDomainId: store.auth.latestDomainId,
            domainList: store.auth.domainList,
            search: store.template.search,
            tpSizeRows: store.codeMgt.tpSizeRows,
            tpZoneRows: store.codeMgt.tpZoneRows,
        }),
        shallowEqual,
    );
    const [search, setSearch] = React.useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({
            ...search,
            [name]: value,
        });
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getTemplateList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 템플릿 사이즈 변경 함수
     * @param {object} e change이벤트
     */
    const handleChangeTpSize = (e) => {
        if (e.target.value === 'all') {
            setSearch({
                ...search,
                templateWidth: e.target.value,
                widthMin: null,
                widthMax: null,
            });
            return;
        }
        try {
            const { widthmin, widthmax } = e.target.selectedOptions[0].dataset;
            setSearch({
                ...search,
                templateWidth: e.target.value,
                widthMin: Number(widthmin),
                widthMax: Number(widthmax),
            });
        } catch (err) {
            setSearch({
                ...search,
                templateWidth: e.target.value,
                widthMin: null,
                widthMax: null,
            });
        }
    };

    useEffect(() => {
        // latestDomainId 변경 => 템플릿의 search.domainId 변경
        if (latestDomainId && latestDomainId !== search.domainId) {
            dispatch(
                getTemplateList(
                    changeSearchOption({
                        ...search,
                        domainId: latestDomainId,
                        page: 0,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    useEffect(() => {
        if (!tpSizeRows) dispatch(getTpSize());
        if (!tpZoneRows) dispatch(getTpZone());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <Form className="mb-2">
            {/* 도메인 선택 */}
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
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
                    <MokaInput as="select" name="templateGroup" value={search.templateGroup} onChange={handleChangeValue}>
                        <option value="all">위치그룹 전체</option>
                        {tpZoneRows &&
                            tpZoneRows.map((cd) => (
                                <option key={cd.dtlCd} value={cd.dtlCd}>
                                    {cd.cdNm}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                {/* 템플릿 사이즈 */}
                <Col xs={5} className="p-0">
                    <MokaInput as="select" value={search.templateWidth} onChange={handleChangeTpSize}>
                        <option value="all">사이즈 전체</option>
                        {tpSizeRows &&
                            tpSizeRows.map((cd) => (
                                <option key={cd.dtlCd} value={cd.dtlCd} data-widthmin={cd.cdNmEtc1} data-widthmax={cd.cdNmEtc2}>
                                    {cd.cdNm}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
            </Form.Row>
            <Form.Group as={Row}>
                {/* 검색조건 */}
                <div className="mr-2 flex-shrink-0">
                    <MokaInput as="select" name="searchType" value={search.searchType || undefined} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                {/* 키워드 */}
                <MokaSearchInput className="flex-fill" value={search.keyword} name="keyword" onChange={handleChangeValue} onSearch={handleSearch} />
            </Form.Group>
        </Form>
    );
};

export default TemplateSearch;
