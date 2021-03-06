import React, { useEffect, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { messageBox } from '@utils/toastUtil';
import { initialState, GET_REPORTER_LIST_MODAL, getReporterListModal } from '@store/reporter';
import { getJplusRep } from '@store/codeMgt';
import Search from './Search';
import AgGrid from './AgGrid';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 선택한 컴포넌트의 데이터
     */
    selectedComponent: PropTypes.object,
    /**
     * drag&drop 타겟 ag-grid
     */
    dropTargetAgGrid: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    /**
     * row를 drop하였을 때 실행하는 함수
     */
    onDragStop: PropTypes.func,
    /**
     * show 일 때만 데이터를 로드한다
     * @default
     */
    show: PropTypes.bool,
};
const defaultProps = {
    show: false,
};

/**
 * 페이지편집 > 기자 목록
 */
const ReporterList = (props) => {
    const { show, className, dropTargetAgGrid, onDragStop } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_REPORTER_LIST_MODAL]);
    const jplusRepRows = useSelector(({ codeMgt }) => codeMgt.jplusRepRows);
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);
    const cntRef = useRef(0);

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
        [dispatch, search],
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
     * 초기화
     */
    const handleReset = useCallback(() => {
        setSearch(initialState.search);
    }, []);

    useEffect(() => {
        if (show) {
            if (!jplusRepRows) {
                dispatch(getJplusRep());
            }

            // 기자 처음 로드
            if (cntRef.current === 0) {
                getReporterList({});
                cntRef.current += 1;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jplusRepRows, show]);

    return (
        <div className={clsx('d-flex flex-column h-100', className)}>
            <Search jplusRepRows={jplusRepRows} search={search} onChangeSearchOption={handleSearchOption} onSearch={handleSearch} onReset={handleReset} />
            <AgGrid
                loading={loading}
                search={search}
                list={rowData}
                total={total}
                onChangeSearchOption={changeTableSearchOption}
                dropTargetAgGrid={dropTargetAgGrid}
                onDragStop={onDragStop}
            />
        </div>
    );
};

ReporterList.propTypes = propTypes;
ReporterList.defaultProps = defaultProps;

export default ReporterList;
