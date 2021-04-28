import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaModal, MokaSearchInput } from '@/components';
import { initialState, getIssueList, clearSearch, changeIssueSearchOptions } from '@store/issue';
import RelIssueAgGrid from '../components/RelIssueAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 이슈 패키지 검색 모달
 */
const NewsLetterPackageModal = ({ show, onHide, channelType, onRowClicked }) => {
    const dispatch = useDispatch();
    const pkgDiv = useSelector(({ app }) => app.PACKAGE_DIV);
    const storeSearch = useSelector(({ issue }) => issue.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 검색
     */
    const handleClickSearch = () => {
        let ns = { ...search, page: 0 };
        dispatch(getIssueList({ search: ns }));
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        let ns;
        if (show && channelType) {
            if (channelType === 'ISSUE') {
                ns = { ...search, scbYn: 'Y', div: 'I' };
            } else if (channelType === 'TOPIC') {
                ns = { ...search, scbYn: 'Y', div: 'T' };
            } else if (channelType === 'SERIES') {
                ns = { ...search, scbYn: 'Y', div: 'S' };
            }
            dispatch(changeIssueSearchOptions(ns));
            dispatch(getIssueList({ search: ns }));
        } else if (!show) {
            dispatch(clearSearch());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, channelType]);

    return (
        <MokaModal size="lg" width={800} height={800} show={show} onHide={onHide} bodyClassName="d-flex flex-column" title="패키지 검색" draggable>
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <Form.Row>
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="select" value={search.div} onChange={(e) => setSearch({ ...search, div: e.target.value })} disabled>
                            {pkgDiv.map((code) => (
                                <option key={code.code} value={code.code}>
                                    {code.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <MokaSearchInput
                        className="flex-fill"
                        value={search.keyword}
                        onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                        onSearch={handleClickSearch}
                        placeholder="패키지 명을 입력하세요"
                    />
                </Form.Row>
            </Form>
            <RelIssueAgGrid pkgDiv={pkgDiv} onRowClicked={onRowClicked} />
        </MokaModal>
    );
};

export default NewsLetterPackageModal;
