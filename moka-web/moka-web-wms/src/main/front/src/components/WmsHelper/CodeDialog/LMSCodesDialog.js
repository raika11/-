import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsDraggableDialog, WmsTable } from '~/components';
import { lgTableColums, mdTableColumns, smTableColumns } from './dialogColumns';
import {
    getLargeCodes,
    getMiddleCodes,
    getSmallCodes,
    changeSearchOption,
    clearSearchOption,
    clearCode
} from '~/stores/code/codeStore';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 대/중/소 다이얼로그
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈함수
 * @param {string} props.searchCodeId 분류
 * @param {func} props.setSearchCodeId 분류 state값 변경 함수
 */
const LMSCodesDialog = (props) => {
    const { open, onClose, searchCodeId, setSearchCodeId } = props;
    const dispatch = useDispatch();
    const classes = useStyle();
    const { largeCodes, middleCodes, smallCodes, lLoading, mLoading, sLoading } = useSelector(
        (state) => ({
            largeCodes: state.codeStore.largeCodes,
            middleCodes: state.codeStore.middleCodes,
            smallCodes: state.codeStore.smallCodes,
            lLoading: state.loadingStore['codeStore/GET_LARGE_CODES'],
            mLoading: state.loadingStore['codeStore/GET_MIDDLE_CODES'],
            sLoading: state.loadingStore['codeStore/GET_SMALL_CODES']
        })
    );
    // local state
    const [codeId, setCodeId] = useState('');
    const [largeCodeId, setLargeCodeId] = useState('');
    const [middleCodeId, setMiddleCodeId] = useState('');
    const [smallCodeId, setSmallCodeId] = useState('');
    // rows
    const [lgRows, setLgRows] = useState([]);
    const [mdRows, setMdRows] = useState([]);
    const [smRows, setSmRows] = useState([]);
    // 카운트
    const [callCnt, setCallCnt] = useState(0);

    // 대분류 최초 로드
    useEffect(() => {
        if (callCnt === 0) {
            dispatch(getLargeCodes());
            setCallCnt(callCnt + 1);
        }
    }, [callCnt, dispatch]);

    // largeCodeId가 있으면 중분류 검색
    useEffect(() => {
        if (largeCodeId !== '') {
            dispatch(
                getMiddleCodes(
                    changeSearchOption({
                        key: 'largeCodeId',
                        value: largeCodeId
                    })
                )
            );
            setSmRows([]);
        }
    }, [largeCodeId, dispatch]);

    // middleCodeId가 있으면 소분류 검색
    useEffect(() => {
        if (middleCodeId !== '') {
            dispatch(
                getSmallCodes(
                    changeSearchOption({
                        key: 'middleCodeId',
                        value: middleCodeId
                    })
                )
            );
        }
    }, [middleCodeId, dispatch]);

    // 대분류 rows 생성
    useEffect(() => {
        if (largeCodes.length > 0) {
            setLgRows(
                largeCodes.map((c) => ({
                    id: String(c.largeCodeId),
                    codeId: c.codeId,
                    codeName: c.codeName,
                    width: 216
                }))
            );
        }
    }, [largeCodes]);

    // 중분류 rows 생성
    useEffect(() => {
        if (middleCodes.length > 0) {
            setMdRows(
                middleCodes.map((m) => ({
                    id: String(m.middleCodeId),
                    codeId: m.codeId,
                    codeName: m.codeName,
                    width: 216
                }))
            );
        }
    }, [middleCodes]);

    // 소분류 rows 생성
    useEffect(() => {
        if (smallCodes.length > 0) {
            setSmRows(
                smallCodes.map((s) => ({
                    id: String(s.smallCodeId),
                    codeId: s.codeId,
                    codeName: s.codeName,
                    width: 216
                }))
            );
        }
    }, [smallCodes]);

    /**
     * 대분류 row의 라디오 버튼 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onLgRowRadioClick = (e, row) => {
        setCodeId(row.codeId);
        setLargeCodeId(row.id);
        setMiddleCodeId('');
        setSmallCodeId('');
    };

    /**
     * 대분류 row 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleLgRowClick = (e, row) => {
        onLgRowRadioClick(e, row);
    };

    /**
     * 중분류 row의 라디오 버튼 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onMdRowRadioClick = (e, row) => {
        if (middleCodeId !== row.id) {
            setCodeId(row.codeId);
            setMiddleCodeId(row.id);
        } else {
            // 동일한 중분류 클릭 시 codeId를 대분류로 셋팅함
            setCodeId(lgRows.find((r) => r.id === largeCodeId).codeId);
            setMiddleCodeId('');
        }
        setSmallCodeId('');
    };

    /**
     * 중분류 row 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleMdRowClick = (e, row) => {
        onMdRowRadioClick(e, row);
    };

    /**
     * 소분류 row의 라디오 버튼 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onSmRowRadioClick = (e, row) => {
        if (smallCodeId !== row.id) {
            setCodeId(row.codeId);
            setSmallCodeId(row.id);
        } else {
            // 동일한 소분류 클릭 시 codeId를 중분류로 셋팅함
            setCodeId(mdRows.find((r) => r.id === middleCodeId).codeId);
            setSmallCodeId('');
        }
    };

    /**
     * 소분류 row 클릭
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleSmRowClick = (e, row) => {
        onSmRowRadioClick(e, row);
    };

    /**
     * 등록버튼
     */
    const onSave = () => {
        setSearchCodeId(codeId);
        onClose();
    };

    useEffect(() => {
        if (searchCodeId) {
            const cId = searchCodeId.codeId;
            setCodeId(cId);
            setLargeCodeId(cId.slice(0, 2));
            setMiddleCodeId(cId.slice(2, 4));
            const sid = cId.slice(4, 7);
            setSmallCodeId(sid !== '000' ? sid : '');
        } else {
            setCodeId('');
            setLargeCodeId('');
            setMiddleCodeId('');
            setSmallCodeId('');
        }
    }, [searchCodeId]);

    useEffect(() => {
        return () => {
            dispatch(clearSearchOption());
            dispatch(clearCode());
        };
    }, [dispatch]);

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="분류 검색"
            maxWidth="lg"
            content={
                <div className={clsx(classes.popupBody, classes.p16)}>
                    <div className={classes.inLine}>
                        <div className={clsx(classes.table, classes.mr16)}>
                            <WmsTable
                                columns={lgTableColums}
                                rows={lgRows}
                                onRowClick={handleLgRowClick}
                                currentId={largeCodeId}
                                paging={false}
                                loading={lLoading}
                                onRowRadioClick={onLgRowRadioClick}
                            />
                        </div>
                        <div className={clsx(classes.table, classes.mr16)}>
                            <WmsTable
                                columns={mdTableColumns}
                                rows={mdRows}
                                onRowClick={handleMdRowClick}
                                currentId={middleCodeId}
                                paging={false}
                                loading={mLoading}
                                onRowRadioClick={onMdRowRadioClick}
                            />
                        </div>
                        <div className={classes.table}>
                            <WmsTable
                                columns={smTableColumns}
                                rows={smRows}
                                onRowClick={handleSmRowClick}
                                currentId={smallCodeId}
                                paging={false}
                                loading={sLoading}
                                onRowRadioClick={onSmRowRadioClick}
                            />
                        </div>
                    </div>
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={onSave}>
                        적용
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        취소
                    </WmsButton>
                </div>
            }
        />
    );
};

export default LMSCodesDialog;
