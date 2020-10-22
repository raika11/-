import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';
import { getReservedList, defaultSearch } from '@store/reserved';

/**
 * 예약어 검색
 */
const ReservedSearch = () => {
    const dispatch = useDispatch();
    const { domains, latestDomainId } = useSelector((store) => ({
        reserved: store.auth.domains,
        latestDomainId: store.auth.latestDomainId,
    }));

    const [search] = useState(defaultSearch);
    const [domainRows, setDomainRows] = useState([]);
    const [searchType, setSearchType] = useState('reservedId');
    const [keyWord, setKeyword] = useState('');
    const [, setSelectedDomain] = useState(search.domainId);

    useEffect(() => {
        const option = {
            ...search,
            domainId: latestDomainId,
        };
        dispatch(getReservedList(option));
    }, [dispatch, latestDomainId, search]);

    // 검색버튼 클릭
    const onSearch = (e) => {
        const option = {
            ...search,
            searchType,
            domainId: latestDomainId,
            keyword: keyWord,
        };
        dispatch(getReservedList(option));
    };

    useEffect(() => {
        if (domains) {
            const rows = domains.map((m) => {
                return {
                    id: m.domainId,
                    name: m.domainName,
                };
            });
            setDomainRows(rows);
        }
    }, [domains]);

    const handleChangeSearchOption = (e) => {
        if (e.target.name === 'selectedDomain') {
            setSelectedDomain(e.target.value);
        } else if (e.target.name === 'searchType') {
            setSearchType(e.target.value);
        } else if (e.target.name === 'keyword') {
            setKeyword(e.target.value);
        }
    };

    return (
        <Form className="mb-10">
            <MokaInput as="select" className="m-0 mb-2" onChange={handleChangeSearchOption}>
                {domainRows.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.name}
                    </option>
                ))}
            </MokaInput>
            <Form.Row className="m-0 mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInput as="select" onChange={handleChangeSearchOption}>
                        <option value="reservedId">코드</option>
                        <option value="reservedValue">값</option>
                    </MokaInput>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput onChange={handleChangeSearchOption} onSearch={onSearch} />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ReservedSearch;
