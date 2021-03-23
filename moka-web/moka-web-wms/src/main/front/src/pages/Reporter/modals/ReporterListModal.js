import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaSearchInput, MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { initialState, getReporterListModal, GET_REPORTER_LIST_MODAL } from '@store/reporter';
import columnDefs from './ReporterListModalColumns';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 기자 목록 모달
 */
const ReporterListModal = (props) => {
    const { show, onHide, onClick } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_REPORTER_LIST_MODAL]);
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

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
                                    belong:
                                        (reporter.r1CdNm ? `${reporter.r1CdNm} / ` : '') +
                                        (reporter.r2CdNm ? `${reporter.r2CdNm} / ` : '') +
                                        (reporter.r3CdNm ? `${reporter.r3CdNm} / ` : '') +
                                        (reporter.r4CdNm ? `${reporter.r4CdNm}` : ''),
                                    onClick,
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
        [search, dispatch, onClick],
    );

    /**
     * 검색조건 변경
     */
    const handleSearchOption = useCallback(
        ({ key, value }) => {
            setSearch({ ...search, [key]: value });
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

    return (
        <MokaModal
            show={show}
            onHide={handleHide}
            title="기자 검색"
            size="xl"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            width={970}
            centered
            draggable
        >
            <div className="mb-14">
                <MokaSearchInput name="keyword" value={search.keyword} onChange={handleSearchOption} onSearch={handleSearch} placeholder="기자 이름을 검색하세요" />
            </div>
            <MokaTable
                agGridHeight={600}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(reporter) => reporter.repSeq}
                onRowClicked={() => {}}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={changeTableSearchOption}
            />
        </MokaModal>
    );
};

ReporterListModal.propTypes = propTypes;
ReporterListModal.defaultProps = defaultProps;

export default ReporterListModal;
