import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import Search from './Search';
import AgGrid from './AgGrid';

moment.locale('ko');

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 선택한 컴포넌트의 데이터
     * @default
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
    selectedComponent: {},
    show: false,
};

const initialSearch = {};

/**
 * 홈 섹션편집 > 패키지 목록
 */
const PackageList = (props) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;
    const loading = false;
    const [period, setPeriod] = useState([2, 'days']);
    const [search, setSearch] = useState(initialSearch);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

    /**
     * 패키지 목록 조회
     */
    const getPackageList = useCallback(({ search: appendSearch }) => {}, []);

    /**
     * 검색조건 변경
     */
    const handleSearchOption = useCallback(
        ({ key, value, number, date }) => {
            if (key === 'period') {
                // 기간 설정
                setPeriod([Number(number), date]);
                const nd = new Date();
                const startServiceDay = moment(nd).subtract(Number(number), date).startOf('day');
                const endServiceDay = moment(nd).endOf('day');
                setSearch({ ...search, startServiceDay, endServiceDay });
            } else {
                setSearch({ ...search, [key]: value });
            }
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
            getPackageList({ search: ns });
        },
        [getPackageList],
    );

    /**
     * 검색조건 초기화
     */
    const handleReset = useCallback(() => {
        const nd = new Date();
        setPeriod([1, 'days']);
        setSearch({
            ...initialSearch,
            page: search.page,
            startServiceDay: moment(nd).subtract(1, 'days').startOf('day'),
            endServiceDay: moment(nd).endOf('day'),
        });
    }, [search.page]);

    return (
        <div className={clsx('d-flex flex-column h-100', className)}>
            <Search
                search={search}
                period={period}
                onChangeSearchOption={handleSearchOption}
                // onSearch={handleSearch}
                onReset={handleReset}
            />

            <AgGrid
                search={search}
                list={rowData}
                total={total}
                loading={loading}
                dropTargetAgGrid={dropTargetAgGrid}
                onDragStop={onDragStop}
                // onSearch={handleSearch}
                onChangeSearchOption={changeTableSearchOption}
            />
        </div>
    );
};

PackageList.propTypes = propTypes;
PackageList.defaultProps = defaultProps;

export default PackageList;
