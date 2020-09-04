import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsTable, WmsDraggableDialog } from '~/components';
import { getVolumes, changeSearchOption, clearVolume } from '~/stores/volume/volumeStore';
import { volumeColumns } from '../components/tableColumns';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 볼륨 다이얼로그
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose onClose
 * @param {string} props.volumeId 볼륨아이디
 * @param {func} props.setVolumeId 볼륨아이디 변경 함수
 * @param {func} props.setVolumeErr 볼륨필드 에러상태 변경 함수
 */
const VolumeDialog = (props) => {
    const { open, onClose, volumeId, setVolumeId, setVolumeErr } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { search, list, total, error, loading } = useSelector((store) => ({
        search: store.volumeStore.search,
        list: store.volumeStore.list,
        total: store.volumeStore.total,
        error: store.volumeStore.error,
        loading: store.loadingStore['volumeStore/GET_VOLUMES']
    }));
    const [loadCnt, setLoadCnt] = useState(0);
    const [rows, setRows] = useState([]);
    const [currentVolume, setCurrentVolume] = useState(volumeId);

    /**
     * 라디오버튼 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const onRowRadioClick = (e, row) => {
        setCurrentVolume(row.volumeId);
    };

    /**
     * row 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const onRowClick = (e, row) => onRowRadioClick(e, row);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const onChangeSearchOption = (payload) => {
        dispatch(getVolumes(changeSearchOption(payload)));
    };

    /**
     * 선택 버튼
     */
    const onSave = () => {
        if (currentVolume) {
            setVolumeId(currentVolume);
            setVolumeErr(false);
            onClose();
        }
    };

    useEffect(() => {
        if (loadCnt < 1) {
            dispatch(
                getVolumes(
                    changeSearchOption({ key: 'size', value: POP_PAGESIZE_OPTIONS[0] }),
                    changeSearchOption({ key: 'page', value: 0 })
                )
            );
            setLoadCnt(loadCnt + 1);
        } else {
            setRows(
                list.map((v) => ({
                    ...v,
                    id: v.volumeId,
                    name: v.volumeName
                }))
            );
        }
    }, [loadCnt, dispatch, list]);

    useEffect(() => {
        return () => {
            dispatch(clearVolume({ search: true, list: true }));
        };
    }, [dispatch]);

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="볼륨 선택"
            maxWidth="sm"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <div className={classes.table}>
                        <WmsTable
                            columns={volumeColumns}
                            rows={rows}
                            total={total}
                            page={search.page}
                            size={search.size}
                            pageSizes={POP_PAGESIZE_OPTIONS}
                            displayPageNum={POP_DISPLAY_PAGE_NUM}
                            currentId={currentVolume}
                            selected={[currentVolume]}
                            loading={loading}
                            error={error}
                            onRowRadioClick={onRowRadioClick}
                            onRowClick={onRowClick}
                            onChangeSearchOption={onChangeSearchOption}
                            popupPaging
                            borderTop
                            borderBottom
                        />
                    </div>
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={onSave}>
                        선택
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        닫기
                    </WmsButton>
                </div>
            }
        />
    );
};

export default VolumeDialog;
