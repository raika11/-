import React, { useEffect, useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { messageBox } from '@utils/toastUtil';
import { initialState, getColumnistListModal, GET_COLUMNIST_LIST_MODAL } from '@store/columnist';
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
 * 페이지편집 > 칼럼니스트 목록
 */
const ColumnistList = (props) => {
    const {
        show,
        className,
        // selectedComponent,
        //  dropTargetAgGrid,
        //   onDragStop,
    } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_COLUMNIST_LIST_MODAL]);
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);
    const cntRef = useRef(0);

    /**
     * 칼럼니스트 조회 함수
     */
    const getColumnistList = useCallback(
        ({ search: appendSearch }) => {
            const ns = { ...search, ...appendSearch };
            setSearch(ns);

            dispatch(
                getColumnistListModal({
                    search: ns,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setRowData(
                                body.list.map((col) => ({
                                    ...col,
                                    profile: (col.profile || '').replaceAll('\n', ' / '),
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
     * 검색조건 초기화
     */
    const handleReset = useCallback(() => {
        setSearch(initialState.search);
    }, []);

    /**
     * 테이블에서 검색조건 변경
     */
    const changeTableSearchOption = useCallback(
        ({ key, value }) => {
            let ns = { [key]: value };
            if (key !== 'page') ns['page'] = 0;
            getColumnistList({ search: ns });
        },
        [getColumnistList],
    );

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        let ns = { page: 0 };
        getColumnistList({ search: ns });
    }, [getColumnistList]);

    useEffect(() => {
        if (show) {
            // 칼럼니스트 처음 로드
            if (cntRef.current === 0) {
                getColumnistList({});
                cntRef.current += 1;
            }
        }
    }, [getColumnistList, show]);

    return (
        <div className={clsx('d-flex flex-column h-100', className)}>
            <Search search={search} onChangeSearchOption={handleSearchOption} onSearch={handleSearch} onReset={handleReset} />
            <AgGrid loading={loading} search={search} list={rowData} total={total} onChangeSearchOption={changeTableSearchOption} />
        </div>
    );
};

ColumnistList.propTypes = propTypes;
ColumnistList.defaultProps = defaultProps;

export default ColumnistList;
