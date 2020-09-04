import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsButton from '~/components/WmsButtons';
import { WmsCard } from '~/components';
import style from '~/assets/jss/pages/EtccodeType/EtccodeTableStyle';
import tableColumns from './components/tableColumns';
import WmsTable from '~/components/WmsTable';
import CodeTypeAddDialog from './dialog/CodeTypeAddDialog';
import {
    changeEditAll,
    putEtccodeType,
    getEtccodeType
} from '~/stores/etccodeType/etccodeTypeStore';

import { getEtccodeList } from '~/stores/etccode/etccodeStore';

const useStyles = makeStyles(style);

const EtccodeTypeListContainer = (props) => {
    let history = useHistory();
    const dispatch = useDispatch();
    const { setSelectedCodeType } = props;

    const classes = useStyles();
    const [codeTypeAddDialogOpen, setCodeTypeAddDialogOpen] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [codeTypeListGetCnt, setCodeTypeListGetCnt] = useState(0);
    const [etccodeTypeRows, setEtccodeTypeRows] = useState([]);
    const [selectCodeTypeId, setselectCodeTypeId] = useState('');

    /**
     * store
     */
    const { etccodeType, total, search, loading } = useSelector((store) => ({
        etccodeType: store.etccodeTypeStore.list,
        total: store.etccodeTypeStore.total,
        search: store.etccodeTypeStore.search,
        selectedEtccodeTypeId: store.etccodeStore.selectedEtccodeTypeId,
        loading: store.loadingStore['etccodeTypeStore/GET_ETCCODE_LIST']
    }));

    /**
     * 목록에서 아이템 클릭 (상세 조회)
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */

    /**
     * row 선택시 codeList call
     * @param {*} e
     * @param {*} row
     */
    const handleRowClick = (e, row) => {
        history.push(row.link);
        const selectCodeTypeInfo = {
            codeTypeId: row.codeTypeId,
            codeTypeSeq: row.codeTypeSeq,
            codeTypeName: row.codeTypeName
        };
        setselectCodeTypeId(row.codeTypeId);
        setSelectedCodeType(selectCodeTypeInfo);
        dispatch(getEtccodeList({ codeTypeId: row.codeTypeId }));
    };

    /**
     * rows 생성
     */
    useEffect(() => {
        if (codeTypeListGetCnt < 1) {
            dispatch(getEtccodeType());
            setCodeTypeListGetCnt(codeTypeListGetCnt + 1);
        }
    }, [etccodeType, dispatch, codeTypeListGetCnt]);

    /**
     * Table정보 display를 위함
     */
    useEffect(() => {
        if (etccodeType) {
            setEtccodeTypeRows(
                etccodeType.map((c) => ({
                    id: String(c.codeTypeId),
                    codeTypeId: String(c.codeTypeId),
                    codeTypeSeq: c.codeTypeSeq,
                    codeTypeName: c.codeTypeName
                }))
            );
        }
    }, [etccodeType]);

    /**
     * 저장, 수정 액션
     * @param {*} row 저장/수정시 입력된 코드그룹의 정보
     */
    const onSave = (row) => {
        dispatch(
            putEtccodeType({
                callback: ({ etccodeTypeSeq }) => history.push('/etccodeType'),
                actions: [changeEditAll(row)]
            })
        );
    };

    return (
        <div className={classes.leftNonTitle}>
            <WmsCard>
                <div className={clsx(classes.button, classes.topBotton)}>
                    <WmsButton
                        color="wolf"
                        overrideClassName={classes.mb8}
                        onClick={() => setCodeTypeAddDialogOpen(true)}
                    >
                        <span>그룹 추가</span>
                    </WmsButton>
                </div>

                <div className={classes.leftTable}>
                    <WmsTable
                        columns={tableColumns}
                        rows={etccodeTypeRows}
                        total={total}
                        page={search.page}
                        size={search.size}
                        onRowClick={handleRowClick}
                        currentId={String(selectCodeTypeId)}
                        loading={loading}
                    />
                </div>
                {/** 코드그룹추가 팝업 */}
                {codeTypeAddDialogOpen && (
                    <CodeTypeAddDialog
                        open={codeTypeAddDialogOpen}
                        onClose={() => setCodeTypeAddDialogOpen(false)}
                        onSave={onSave}
                        alertOpen={alertOpen}
                        setAlertOpen={setAlertOpen}
                    />
                )}
            </WmsCard>
        </div>
    );
};

export default EtccodeTypeListContainer;
