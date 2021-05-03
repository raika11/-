import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput } from '@/components';
// import { initialState, getIssueList, clearSearch, changeIssueSearchOptions } from '@store/issue';
// import { getNewsLetterChannelType } from '@store/newsLetter';
// import { messageBox } from '@/utils/toastUtil';
import ArticlePackageAgGrid from '../components/RelArticlePackageAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 기사 패키지 검색 모달
 */
const NewsLetterArticlePackageModal = ({ show, onHide, channelType, onRowClicked }) => {
    // const dispatch = useDispatch();
    const [search, setSearch] = useState({});

    /**
     * 검색
     */
    const handleClickSearch = () => {};

    // useEffect(() => {
    //     setSearch(storeSearch);
    // }, [storeSearch]);

    // useEffect(() => {
    //     let ns;
    //     if (show && channelType) {
    //         dispatch(
    //             getNewsLetterChannelType({
    //                 channelType,
    //                 callback: ({ header, body }) => {
    //                     if (header.success && body) {
    //                         // dispatch(changeIssueSearchOptions(ns));
    //                         // dispatch(getIssueList({ search: ns }));
    //                     } else {
    //                         messageBox.alert(header.message);
    //                     }
    //                 },
    //             }),
    //         );
    //     } else if (!show) {
    //         // dispatch(clearSearch());
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [show, channelType]);

    return (
        <MokaModal size="md" width={600} height={800} show={show} onHide={onHide} bodyClassName="d-flex flex-column" title="기사 패키지 검색" draggable>
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaSearchInput
                    className="flex-fill"
                    value={search.keyword}
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                    onSearch={handleClickSearch}
                    placeholder="패키지 명을 입력하세요"
                />
            </Form>
            <ArticlePackageAgGrid onRowClicked={onRowClicked} />
        </MokaModal>
    );
};

export default NewsLetterArticlePackageModal;
