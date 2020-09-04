import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable } from '~/components';
import { getAds, changeSearchOption } from '~/stores/ad/adStore';
import { adColumns } from './dialogColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';

const useStyle = makeStyles(style);

const AdDialogTable = (props) => {
    const { adSeq, setAdSeq, setAdName } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const [adRows, setAdRows] = useState([]);
    const { search, total, list, loading, error } = useSelector((state) => ({
        search: state.adStore.search,
        total: state.adStore.total,
        list: state.adStore.list,
        loading: state.loadingStore['adStore/GET_ADS'],
        error: state.adStore.error
    }));

    /**
     * 라디오 버튼 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onRowRadioClick = (e, row) => {
        setAdSeq(row.adSeq);
        setAdName(row.adName);
    };

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {
        // 라디오버튼 클릭 실행
        onRowRadioClick(e, row);
    };

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값 { key, value }
     */
    const handleChangeSearchOption = (payload) => {
        dispatch(getAds(changeSearchOption(payload)));
    };

    useEffect(() => {
        if (list.length > 0) {
            setAdRows(
                list.map((l) => ({
                    id: String(l.adSeq),
                    adSeq: l.adSeq,
                    adLocation: l.adLocation,
                    adName: l.adName,
                    useYn: l.useYn
                }))
            );
        }
    }, [list]);

    return (
        <div className={classes.table}>
            <WmsTable
                columns={adColumns}
                rows={adRows}
                total={total}
                page={search.page}
                size={search.size}
                pageSizes={POP_PAGESIZE_OPTIONS}
                displayPageNum={POP_DISPLAY_PAGE_NUM}
                onRowClick={handleRowClick}
                onRowRadioClick={onRowRadioClick}
                onChangeSearchOption={handleChangeSearchOption}
                currentId={String(adSeq)}
                selected={[String(adSeq)]}
                loading={loading}
                error={error}
                popupPaging
                borderTop
                borderBottom
            />
        </div>
    );
};

export default AdDialogTable;
