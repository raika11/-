import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput } from '@/components';
import { initialState, getEditFormList, changeSearchOption, clearStore } from '@store/editForm';
import RelEditFormAgGrid from '../components/RelEditFormAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 편집폼 선택 모달
 */
const NewsLetterEditFormModal = ({ show, onHide, onRowClicked }) => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ editForm }) => editForm.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 검색
     */
    const handleClickSearch = () => {
        let ns = { ...search, page: 0 };
        dispatch(getEditFormList(changeSearchOption(ns)));
    };

    /**
     * 모달 닫기
     */
    const handleClickHide = () => {
        dispatch(clearStore());
        onHide();
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (show) {
            dispatch(getEditFormList());
        }
    }, [show, dispatch]);

    return (
        <MokaModal size="md" width={600} height={800} show={show} onHide={handleClickHide} bodyClassName="d-flex flex-column" title="편집폼 검색" draggable>
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaSearchInput
                    className="flex-fill"
                    placeholder="검색어를 입력하세요"
                    value={search.keyword}
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                    onSearch={handleClickSearch}
                />
            </Form>
            <RelEditFormAgGrid onRowClicked={onRowClicked} onHide={onHide} />
        </MokaModal>
    );
};

export default NewsLetterEditFormModal;
