import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, changeSearchOption, GET_REPORTER_LIST_MODAL, getReporterListModal, getReporterList } from '@store/reporter';
import { columnDefs } from './ReporterModalAgGridColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import Button from 'react-bootstrap/Button';
import bg from '@assets/images/bg.jpeg';
import { clearStore } from '@store/dataset';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
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

    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const ReporterMgrSearchModal = (props) => {
    const { show, onHide, onClickSave } = props;
    const dispatch = useDispatch();
    const { keyword, loading } = useSelector((store) => ({
        keyword: store.reporter.search.keyword,
        loading: store.loading[GET_REPORTER_LIST_MODAL],
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(initialState.total);
    const [error, setError] = useState(initialState.error);
    const [selected, setSelected] = useState('');
    const [rowData, setRowData] = useState([]);
    const [cnt, setCnt] = useState(0);

    /**
     * 리스트 조회 콜백
     */
    const responseCallback = useCallback(({ header, body }) => {
        if (header.success) {
            console.log('bbbbbbbbbbbbb::', body.list);
            setRowData([]);
            setRowData(
                body.list.map((data) => ({
                    ...data,
                    belong: (data.r1CdNm || '') + (data.r2CdNm || '') + (data.r3CdNm || '') + (data.r4CdNm || ''),
                    onClickSave,
                    handleHide,
                    repImg: data.repImg || bg,
                })),
            );
            setTotal(body.totalCnt);
            setError(initialState.error);
        } else {
            setRowData([]);
            setTotal(initialState.total);
            setError(body);
        }
    });

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setRowData([]);
        setTotal(initialState.total);
        setError(null);
        setCnt(0);
        onHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        setRowData([]);
        setTotal(initialState.total);
        setError(null);
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
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {}, []);

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
     * 테이블 검색옵션 변경1
     */

    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        setSearch(temp);
        dispatch(
            getReporterListModal({
                search: {
                    ...temp,
                    page: 0,
                },
                callback: responseCallback,
            }),
        );
    };

    /**
     * 테이블 검색옵션 변경1
     */

    const handleChangeSearchOptions = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        setSearch(temp);

        const ns = {
            ...temp,
            keyword: keyword,
        };

        dispatch(
            getReporterListModal({
                search: ns,
                callback: responseCallback,
            }),
        );
    };

    useEffect(() => {
        if (show && cnt < 1) {
            const ns = {
                ...search,
                keyword: keyword,
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
    }, [keyword, show, cnt, search, dispatch, responseCallback]);

    return (
        <MokaModal show={show} onHide={handleHide} title="기자 검색" size="xl" footerClassName="justify-content-center" width={970} draggable>
            <Form>
                <Form.Row>
                    {/* 키워드 */}
                    <Col xs={5} className="p-0 mb-2">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    keyword: e.target.value,
                                });
                            }}
                            onSearch={handleSearch}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button
                            variant="gray150"
                            onClick={() => {
                                handleClickCancle();
                            }}
                        >
                            초기화
                        </Button>
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={600}
                getRowHeight={40}
                error={error}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(reporter) => reporter.id}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOptions}
                selected={selected}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
            />
        </MokaModal>
    );
};

ReporterMgrSearchModal.propTypes = propTypes;
ReporterMgrSearchModal.defaultProps = defaultProps;

export default ReporterMgrSearchModal;
