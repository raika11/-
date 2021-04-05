import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaSearchInput, MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { JPLUS_REP_DIV_DEFAULT } from '@/constants';
import { initialState, getReporterListModal, GET_REPORTER_LIST_MODAL } from '@store/reporter';
import columnDefs from './ReporterListModalColumns';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * row click (add버튼)
     */
    onRowClicked: PropTypes.func,
};
const defaultProps = {};

/**
 * 기자 목록 모달
 */
const ReporterListModal = (props) => {
    const { show, onHide, onRowClicked } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_REPORTER_LIST_MODAL]);
    const [setGridInstance] = useState(null);
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

    /**
     * row 클릭
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (row) => {
            if (onRowClicked) {
                onRowClicked(row);
            }
        },
        [onRowClicked],
    );

    /**
     * 기자 조회 함수
     */
    const getReporterList = useCallback(
        ({ search: appendSearch }) => {
            const ns = { ...search, ...appendSearch };
            setSearch(ns);

            dispatch(
                getReporterListModal({
                    search: ns,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setRowData(
                                body.list.map((reporter) => ({
                                    ...reporter,
                                    jplusRepDivNm: (reporter.jplusRepDivNm || JPLUS_REP_DIV_DEFAULT).slice(0, 2),
                                    onClick: handleRowClicked,
                                })),
                            );
                            setTotal(body.totalCnt);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [search, dispatch, handleRowClicked],
    );

    /**
     * 검색조건 변경
     */
    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSearch({ ...search, [name]: value });
        },
        [search],
    );

    /**
     * 테이블에서 검색조건 변경
     */
    const changeTableSearchOption = useCallback(
        ({ key, value }) => {
            let ns = { [key]: value };
            if (key !== 'page') ns['page'] = 0;
            getReporterList({ search: ns });
        },
        [getReporterList],
    );

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        let ns = { page: 0 };
        getReporterList({ search: ns });
    }, [getReporterList]);

    /**
     * 취소
     */
    const handleHide = () => {
        setSearch(initialState.search);
        setRowData([]);
        setTotal(0);
        onHide();
    };

    useEffect(() => {
        if (show) {
            getReporterList({});
        } else {
            setSearch(initialState.search);
            setRowData([]);
            setTotal(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        if (show) {
            setRowData(
                rowData.map((row) => ({
                    ...row,
                    onClick: handleRowClicked,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, handleRowClicked]);

    return (
        <MokaModal
            show={show}
            onHide={handleHide}
            title="기자 검색"
            size="xl"
            bodyClassName="d-flex flex-column"
            footerClassName="d-flex justify-content-center"
            width={970}
            height={800}
            centered
            draggable
        >
            <div className="mb-14">
                <MokaSearchInput name="keyword" value={search.keyword} onChange={handleChange} onSearch={handleSearch} placeholder="기자 이름을 검색하세요" />
            </div>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={45}
                onRowNodeId={(reporter) => reporter.repSeq}
                onRowClicked={() => {}}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                setGridInstance={setGridInstance}
                onChangeSearchOption={changeTableSearchOption}
            />
        </MokaModal>
    );
};

ReporterListModal.propTypes = propTypes;
ReporterListModal.defaultProps = defaultProps;

export default ReporterListModal;
