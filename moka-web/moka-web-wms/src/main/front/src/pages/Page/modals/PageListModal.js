import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInput, MokaSearchInput, MokaTable } from '@components';
import { initialState, getPageListModal, GET_PAGE_LIST_MODAL } from '@store/page';
import columnDefs from './PageListModalColums';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 모달 타이틀
     */
    title: PropTypes.string,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,
    /**
     * 전달받은 domainId가 없으면 latestDomainId로 검색한다
     */
    domainId: PropTypes.string,
};
const defaultProps = {
    title: '페이지 검색',
};

/**
 * 페이지 리스트 공통 모달
 */
const PageListModal = (props) => {
    const { show, onHide, title, onClickSave, onClickCancle, selected: defaultSelected, domainId } = props;
    const dispatch = useDispatch();

    const { latestDomainId, loading } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        loading: store.loading[GET_PAGE_LIST_MODAL],
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(initialState.total);
    const [error, setError] = useState(initialState.error);
    const [selected, setSelected] = useState('');
    const [selectedPage, setSelectedPage] = useState({});
    const [rowData, setRowData] = useState([]);
    const [cnt, setCnt] = useState(0);

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    /**
     * 리스트 조회 콜백
     */
    const responseCallback = ({ header, body }) => {
        if (header.success) {
            setRowData(body.list);
            setTotal(body.totalCnt);
            setError(initialState.error);
        } else {
            setRowData([]);
            setTotal(initialState.total);
            setError(body);
        }
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setRowData([]);
        setTotal(initialState.total);
        setSelected('');
        setSelected({});
        setError(null);
        setCnt(0);
        onHide();
    };

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedPage);
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        if (onClickCancle) onClickCancle();
        handleHide();
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getPageListModal({
                search: {
                    ...search,
                    page: 0,
                },
                callback: responseCallback,
            }),
        );
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        setSearch(temp);
        dispatch(getPageListModal({ search: temp, callback: responseCallback }));
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {
        setSelectedPage(data);
        setSelected(data.pageSeq);
    }, []);

    /**
     * 체크박스 변경
     */
    const handleSelectionChanged = useCallback(
        (selectedNodes) => {
            if (selectedNodes.length > 0) {
                const sd = selectedNodes[0].data;
                if (sd.pageSeq !== selected) {
                    setSelectedPage(sd);
                    setSelected(sd.templateSeq);
                }
            }
        },
        [selected],
    );

    useEffect(() => {
        if (show && cnt < 1) {
            const ns = {
                ...initialState.search,
                domainId: !domainId ? latestDomainId : domainId,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
            };
            setSearch(ns);
            dispatch(
                getPageListModal({
                    search: ns,
                    callback: responseCallback,
                }),
            );
            setCnt(cnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestDomainId, domainId, show, cnt]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title={title}
            size="md"
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">
                    {/* 검색 조건 */}
                    <div className="mr-2 flex-shrink-0">
                        <MokaInput
                            as="select"
                            value={search.searchType}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    searchType: e.target.value,
                                });
                            }}
                        >
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    {/* 키워드 */}
                    <MokaSearchInput
                        className="flex-fill"
                        value={search.keyword}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                keyword: e.target.value,
                            });
                        }}
                        onSearch={handleSearch}
                    />
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={501}
                error={error}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.pageSeq}
                onRowClicked={handleRowClicked}
                onSelectionChanged={handleSelectionChanged}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={selected}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
            />
        </MokaModal>
    );
};

PageListModal.propTypes = propTypes;
PageListModal.defaultProps = defaultProps;

export default PageListModal;
