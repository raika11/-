import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { columnDefs } from './ReporterModalAgGridColumns';
import { initialState, changeSearchOption, GET_REPORTER_LIST, getReporterList, getReporter } from '@store/reporter';
import PropTypes from 'prop-types';
export const { searchTypeList } = initialState;

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 선택 버튼 클릭
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
     * 제외 데이터셋아이디
     */
    exclude: PropTypes.any,
};
const defaultProps = {};

/**
 * 기자 검색 모달 AgGrid
 */
const ReporterModalAgGrid = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected, exclude } = props;
    const dispatch = useDispatch();

    // const { reporter, list, total, search, loading } = useSelector((store) => ({
    //     reporter: store.reporter.reporter,
    //     list: store.reporter.list,
    //     total: store.reporter.total,
    //     search: store.reporter.search,
    //     loading: store.loading[GET_REPORTER_LIST],
    // }));

    // useEffect(() => {
    //     // 기자 목록
    //     dispatch(getReporterList());
    // }, [dispatch]);

    // 퍼블리싱용 state 개발하실 때 삭제바랍니다.
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    // /**
    //  * 테이블에서 검색옵션 변경
    //  */
    // const handleChangeSearchOption = useCallback(
    //     ({ key, value }) => {
    //         let temp = { ...search, [key]: value };
    //         if (key !== 'page') {
    //             temp['page'] = 0;
    //         }
    //         dispatch(getReporterList(changeSearchOption(temp)));
    //     },
    //     [dispatch, search],
    // );

    // /**
    //  * 목록에서 Row클릭
    //  */
    // const handleRowClicked = useCallback(
    //     (list) => {
    //         //console.log("list::" + this.list.id);
    //         // dispatch(getReporter());
    //         history.push(`/reporter/${list.repSeq}`);
    //     },
    //     [history],
    // );

    return (
        <MokaTable
            columnDefs={columnDefs}
            //rowData={rowData}
            onRowNodeId={(reporter) => reporter.repSeq}
            agGridHeight={600}
            getRowHeight={40}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={reporter.repSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ReporterModalAgGrid;
