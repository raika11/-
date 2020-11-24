import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Search from '../components/ReporterSearch';
import AgGrid from '../components/ReporterSearchAgGrid';
import bg from '@assets/images/v_noimg.jpg';
import { MokaModal } from '@components';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import { initialState, getReporterListModal } from '@store/reporter';

/**
 * 기자 검색 공통 모달
 */
const ReporterSearchListModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();

    // state
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(initialState.total);
    const [cnt, setCnt] = useState(0);
    const [rowData, setRowData] = useState([]);

    /**
     * 리스트 조회 콜백
     */
    const responseCallback = ({ header, body }) => {
        if (header.success) {
            setRowData(
                body.list.map((data) => ({
                    ...data,
                    belong: (data.r1CdNm || '') + (data.r2CdNm || '') + (data.r3CdNm || '') + (data.r4CdNm || ''),
                    repImg: data.repImg || bg,
                })),
            );
            setTotal(body.totalCnt);
        } else {
            setRowData([]);
            setTotal(initialState.total);
        }
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setRowData([]);
        setTotal(initialState.total);
        setCnt(0);
        onHide();
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getReporterListModal({
                search: {
                    ...search,
                    page: 0,
                },
                callback: responseCallback,
            }),
        );
    };

    /**
     * 초기화
     */
    const handleReset = () => {
        setRowData([]);
        setTotal(initialState.total);
        setCnt(0);
        setSearch(initialState.search);

        dispatch(
            getReporterListModal({
                search: {
                    ...search,
                    page: 0,
                },
                callback: responseCallback,
            }),
        );
    };

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        setSearch(temp);

        const ns = {
            ...temp,
            keyword: search.keyword,
        };

        dispatch(
            getReporterListModal({
                search: ns,
                callback: responseCallback,
            }),
        );
    };

    /**
     * input 값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'search') {
            setSearch({
                ...search,
                keyword: value,
            });
        }
    };

    /**
     * 기자 목록 셋팅
     */
    useEffect(() => {
        if (show && cnt < 1) {
            const ns = {
                ...search,
                keyword: search.keyword,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
            };
            setSearch(ns);
            dispatch(
                getReporterListModal({
                    search: ns,
                    callback: responseCallback,
                }),
            );
            setCnt(cnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, cnt]);

    return (
        <>
            <MokaModal title="기자 검색" width={1012} size="xl" show={show} onHide={handleHide} draggable>
                <Search search={search} callback={responseCallback} onChange={handleChangeValue} onSearch={handleSearch} onReset={handleReset} />
                <AgGrid
                    search={search}
                    rowData={rowData}
                    total={total}
                    page={search.page}
                    size={search.size}
                    pageSizes={MODAL_PAGESIZE_OPTIONS}
                    handleChangeSearchOption={handleChangeSearchOption}
                />
            </MokaModal>
        </>
    );
};

export default ReporterSearchListModal;
