import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs from './TourListAgGridColumns';
import { GET_TOUR_APPLY_LIST, getTourApplyList, changeSearchOption, getTourApply } from '@/store/tour';
import { BASIC_DATEFORMAT } from '@/constants';
import moment from 'moment';

/**
 * 신청 목록 AgGrid
 */
const TourListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const list = useSelector((store) => store.tour.list);
    const total = useSelector((store) => store.tour.total);
    const search = useSelector((store) => store.tour.search);
    const tourApply = useSelector((store) => store.tour.tourApply);
    const loading = useSelector((store) => store.loading[GET_TOUR_APPLY_LIST]);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getTourApplyList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            dispatch(
                getTourApply({
                    tourSeq: row.tourSeq,
                    callback: ({ header, body }) => {
                        if (header.success && body) {
                            history.push(`${match.path}/${row.tourSeq}`);
                        }
                    },
                }),
            );
        },
        [dispatch, history, match.path],
    );

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                tourDate: data.tourDate?.substr(0, 10),
                regDt: data.regDt ? moment(data.regDt).format(BASIC_DATEFORMAT) : '',
            })),
        );
    }, [list]);

    return (
        <MokaTable
            className="flex-fill overflow-hidden"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.tourSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            selected={tourApply.tourSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default TourListAgGrid;
