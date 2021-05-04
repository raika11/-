import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput } from '@/components';
import { getContainerListModal, GET_CONTAINER_LIST_MODAL } from '@/store/container';
import { CONTAINER_GROUP, PAGESIZE_OPTIONS } from '@/constants';
import toast from '@/utils/toastUtil';
import RelContainerAgGrid from '../components/RelContainerAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 레이아웃 선택 모달
 */
const NewsLetterLayoutModal = ({ show, onHide, onRowClicked }) => {
    const dispatch = useDispatch();
    const { latestDomainId } = useSelector(({ auth }) => auth);
    const [total, setTotal] = useState(0);
    const loading = useSelector(({ loading }) => loading[GET_CONTAINER_LIST_MODAL]);
    // 컨테이너 모달 검색조건 로컬에서 관리
    const [search, setSearch] = useState({
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'containerSeq,desc',
        domainId: null,
        searchType: 'all',
        keyword: '',
        usePaging: 'Y',
        containerGroup: CONTAINER_GROUP[1].value,
    });
    const [list, setList] = useState([]);

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        (data) => {
            setSearch({ ...search, ...data });
        },
        [search],
    );

    /**
     * 닫기
     */
    const handleClickHide = useCallback(() => {
        setTotal(0);
        setSearch({ ...search, page: 0, size: PAGESIZE_OPTIONS[0], domainId: null, keyword: '' });
        setList([]);
        onHide();
    }, [onHide, search]);

    /**
     * 등록 버튼
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (data) => {
            if (onRowClicked) {
                onRowClicked(data);
                handleClickHide();
            }
        },
        [handleClickHide, onRowClicked],
    );

    /**
     * 검색
     */
    const handleClickSearch = () => {
        let ns = { ...search, page: 0 };
        setSearch(ns);
        dispatch(
            getContainerListModal({
                search: ns,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setTotal(body.totalCnt);
                        setList(
                            body.list.map((c) => ({
                                ...c,
                                onClick: handleRowClicked,
                            })),
                        );
                    } else {
                        toast.fail(header.message);
                        setTotal(0);
                        setList([]);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        if (show && latestDomainId) {
            if (latestDomainId !== search.domainId) {
                let ns = { ...search, domainId: latestDomainId };
                setSearch(ns);
                dispatch(
                    getContainerListModal({
                        search: ns,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                setTotal(body.totalCnt);
                                setList(
                                    body.list.map((c) => ({
                                        ...c,
                                        onClick: handleRowClicked,
                                    })),
                                );
                            } else {
                                toast.fail(header.message);
                                setTotal(0);
                                setList([]);
                            }
                        },
                    }),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, latestDomainId]);

    return (
        <MokaModal size="md" width={600} height={800} show={show} onHide={handleClickHide} bodyClassName="d-flex flex-column" title="레이아웃 선택" draggable>
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaSearchInput
                    className="flex-fill"
                    placeholder="레이아웃 명을 입력하세요"
                    value={search.keyword}
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                    onSearch={handleClickSearch}
                />
            </Form>
            <RelContainerAgGrid
                search={search}
                total={total}
                setTotal={setTotal}
                list={list}
                setList={setList}
                loading={loading}
                onRowClicked={onRowClicked}
                handleRowClicked={handleRowClicked}
                onChangeValue={handleChangeValue}
            />
        </MokaModal>
    );
};

export default NewsLetterLayoutModal;
