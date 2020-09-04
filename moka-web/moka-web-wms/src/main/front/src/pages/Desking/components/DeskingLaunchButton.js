import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { WmsIconButton, WmsDialogAlert } from '~/components';
import ImportHistDialog from '../dialog/ImportHistDialog';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

const useStyle = makeStyles(style);

/**
 * 데스킹 히스토리 > 불러오기
 */
const DeskingLaunchButton = (props) => {
    const { row } = props;
    const classes = useStyle();
    const search = useSelector((store) => store.deskingHistoryStore.allDetail.search);
    const [importHistDialog, setImportHistDialog] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertContent, setContent] = useState(null);

    // 저장 다이얼로그 오픈
    const handleImportHistDialogOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (search.creator) {
            setImportHistDialog(true);
        } else {
            setContent(
                <Typography variant="subtitle2" className={classes.center}>
                    히스토리를 선택해주세요.
                </Typography>
            );
            setAlert(true);
        }
    };

    // 팝업저장 다이얼로그 종료
    const handleImportHistDialogClose = (isSave) => {
        setImportHistDialog(false);
        // if (isSave) {
        //     onClose(); // 불러온 경우, 히스토리다이얼로그도 종료
        // }
    };

    return (
        <>
            <WmsIconButton icon="launch" onClick={handleImportHistDialogOpen} />
            {/* Alert */}
            <WmsDialogAlert type="show" open={alert} onClose={() => setAlert(false)}>
                {alertContent}
            </WmsDialogAlert>

            {/** 히스토리 불러오기 */}
            {importHistDialog && search.createYmdt && (
                <ImportHistDialog
                    open={importHistDialog}
                    onClose={handleImportHistDialogClose}
                    datasetSeq={row.datasetSeq}
                    histCreator={search.creator}
                    histCreateYmdt={search.createYmdt}
                />
            )}
        </>
        );
};

export default DeskingLaunchButton;
