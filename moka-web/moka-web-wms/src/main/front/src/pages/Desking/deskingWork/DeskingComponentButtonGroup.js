import React, { useState, Suspense } from 'react';
import clsx from 'clsx';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import FullscreenOutlinedIcon from '@material-ui/icons/FullscreenOutlined';
import LinkIcon from '@material-ui/icons/Link';
import UpdateIcon from '@material-ui/icons/Update';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { WmsText, WmsIconButton, WmsDialogAlert } from '~/components';
import { agGrids } from '~/utils/agGridUtil';
import {
    openDummyForm,
    changeContents,
    deleteDeskingWorkList
} from '~/stores/desking/deskingStore';
import style from '~/assets/jss/pages/Desking/DeskingListStyle';
import { previewComponent } from '~/stores/page/mergeStore';

// 버튼 다이얼로그
const ReservationDialog = React.lazy(() => import('../dialog/ReservationDialog'));
const HtmlEditDialog = React.lazy(() => import('../dialog/HtmlEditDialog'));
const TemplateEditDialog = React.lazy(() => import('../dialog/TemplateEditDialog'));
const HistoryManagementDialog = React.lazy(() => import('../dialog/HistoryManagementDialog'));
const RegisterDialog = React.lazy(() => import('../dialog/RegisterDialog'));
const RelationArticleDialog = React.lazy(() => import('../dialog/RelationArticleDialog'));
const ComponentSaveDialog = React.lazy(() => import('../dialog/ComponentSaveDialog'));

const useStyles = makeStyles(style);

/**
 * 컴포넌트의 탑버튼 그룹
 * @param {array} props.component 컴포넌트 데이터
 * @param {number} props.agGridIndex 해당 컴포넌트가 데스킹 AgGrid 중에서 몇번째인지 알려주는 인덱스
 */
const DeskingComponentButtonGroup = (props) => {
    const { component, agGridIndex } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selectedContentsId, setSelectedContentsId] = useState(undefined);
    const [selectedRows, setSelectedRows] = useState([]);
    const match = useRouteMatch();

    // 다이얼로그
    const [reservationDialog, setReservationDialog] = useState(false);
    const [htmlEditDialog, setHtmlEditDialog] = useState(false);
    const [templateEditDialog, setTemplateEditDialog] = useState(false);
    const [historyManagementDialog, setHistoryManagementDialog] = useState(false);
    const [registerDialog, setRegisterDialog] = useState(false);
    const [relationArticleDialog, setRelationArticleDialog] = useState(false);
    const [componentSaveDialog, setComponentSaveDialog] = useState(false);

    // 확인 다이얼로그
    const [alert, setAlert] = useState(false);
    const [alertContent, setContent] = useState(null);

    // 관련기사 다이얼로그 오픈
    const handleRelationDialog = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { api } = agGrids.prototype.grids[agGridIndex];
        if (api.getSelectedRows().length < 1) {
            setContent(
                <Typography variant="subtitle2" className={classes.center}>
                    하나의 기사를 선택해주세요.
                </Typography>
            );
            setAlert(true);
        } else if (api.getSelectedRows().length > 1) {
            setContent(
                <Typography variant="subtitle2" className={classes.center}>
                    하나의 기사만 선택해주세요.
                </Typography>
            );
            setAlert(true);
        } else {
            // 선택된 기사가 더미기사가 아닐 때에만 관련기사 설정가능
            const rowData = api.getSelectedRows()[0];
            if (rowData.contentsAttr === 'D') {
                setContent(
                    <Typography variant="subtitle2" className={classes.center}>
                        더미기사는 관련기사를 설정할 수 없습니다.
                    </Typography>
                );
                setAlert(true);
            } else {
                setSelectedContentsId(rowData.contentsId);
                setSelectedRows([rowData]);
                setRelationArticleDialog(true);
            }
        }
    };

    // 더미기사 추가 버튼 클릭
    const handleDummyForm = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 더미폼으로 변경
        dispatch(openDummyForm(true));
        // 선택된 컴포넌트 설정 + 컨텐츠아이디 초기화
        dispatch(
            changeContents({
                component,
                contentsId: null
            })
        );
    };

    // HTML편집 오픈
    const handleHtmlEditDialogOpen = () => {
        const pageSeq = Number(match.params.pageSeq);
        const option = {
            pageSeq,
            componentWorkSeq: component.seq,
            resourceYn: 'N'
        };
        dispatch(previewComponent(option));

        setHtmlEditDialog(true);
    };

    // HTML편집 종료
    const handleHtmlEditDialogClose = () => {
        setHtmlEditDialog(false);
    };

    // 기사이동 다이얼로그 오픈
    const handleRegisterDialog = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { api } = agGrids.prototype.grids[agGridIndex];
        if (api.getSelectedRows().length < 1) {
            setContent(
                <Typography variant="subtitle2" className={classes.center}>
                    기사를 선택해주세요.
                </Typography>
            );
            setAlert(true);
        } else {
            setSelectedRows(api.getSelectedRows());
            setRegisterDialog(true);
        }
    };

    // 기사삭제 클릭
    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { api } = agGrids.prototype.grids[agGridIndex];
        if (api.getSelectedRows().length < 1) {
            setContent(
                <Typography variant="subtitle2" className={classes.center}>
                    삭제할 기사를 선택해주세요.
                </Typography>
            );
            setAlert(true);
        } else {
            const list = api.getSelectedRows();
            const option = {
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                list
            };
            dispatch(deleteDeskingWorkList(option));
        }
    };

    return (
        <>
            <div className={classes.buttonGroupTop}>
                <div className={classes.buttonGroup}>
                    <WmsIconButton
                        overrideClassName={clsx(classes.iconButton, classes.reservedButton)}
                        onClick={() => setReservationDialog(true)}
                        title="예약"
                        disableRipple
                        focusRipple
                    >
                        <AlarmAddIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsText
                        name="deskingId"
                        value={` ${component.componentSeq}_${component.componentName}`}
                        title={`데이타셋ID: ${component.datasetSeq}`}
                    />
                </div>
                <div className={classes.buttonGroup}>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={handleRelationDialog}
                        title="관련기사 정보"
                        disableRipple
                        focusRipple
                    >
                        <LinkIcon className={classes.svg} />
                    </WmsIconButton>
                    <Divider orientation="vertical" component="hr" className={classes.divider} />
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={handleHtmlEditDialogOpen}
                        title="HTML 수동편집"
                        disableRipple
                        focusRipple
                    >
                        <AspectRatioIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={() => setTemplateEditDialog(true)}
                        title="템플릿"
                        disableRipple
                        focusRipple
                    >
                        <FullscreenOutlinedIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={() => setHistoryManagementDialog(true)}
                        title="히스토리"
                        disableRipple
                        focusRipple
                    >
                        <UpdateIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={handleRegisterDialog}
                        title="기사 이동"
                        disableRipple
                        focusRipple
                    >
                        <LowPriorityIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        title="더미기사 추가"
                        disableRipple
                        focusRipple
                        onClick={handleDummyForm}
                    >
                        <AddBoxOutlinedIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={() => setComponentSaveDialog(true)}
                        title="전송"
                        disableRipple
                        focusRipple
                    >
                        <ScreenShareOutlinedIcon className={classes.svg} />
                    </WmsIconButton>
                    <WmsIconButton
                        overrideClassName={classes.iconButton}
                        onClick={handleDeleteClick}
                        title="삭제"
                        disableRipple
                        focusRipple
                    >
                        <DeleteOutlinedIcon className={classes.svg} />
                    </WmsIconButton>
                </div>
            </div>

            {/** 컴포넌트 예약 설정  */}
            <Suspense>
                <ReservationDialog
                    open={reservationDialog}
                    onClose={() => setReservationDialog(false)}
                />
            </Suspense>

            {/** 관련기사 정보  */}
            <Suspense>
                <RelationArticleDialog
                    open={relationArticleDialog}
                    onClose={() => setRelationArticleDialog(false)}
                    component={component}
                    contentsId={selectedContentsId}
                />
            </Suspense>

            {/** HTML 수동 편집  */}
            <Suspense>
                <HtmlEditDialog
                    open={htmlEditDialog}
                    onClose={handleHtmlEditDialogClose}
                    component={component}
                />
            </Suspense>

            {/** 템플릿 정보  */}
            <Suspense>
                <TemplateEditDialog
                    open={templateEditDialog}
                    onClose={() => setTemplateEditDialog(false)}
                    component={component}
                />
            </Suspense>

            {/** 히스토리 관리  */}
            <Suspense>
                <HistoryManagementDialog
                    open={historyManagementDialog}
                    onClose={() => setHistoryManagementDialog(false)}
                    component={component}
                />
            </Suspense>

            {/** 기사 이동 */}
            <Suspense>
                <RegisterDialog
                    open={registerDialog}
                    onClose={() => setRegisterDialog(false)}
                    agGridIndex={agGridIndex}
                    component={component}
                    moveRows={selectedRows}
                />
            </Suspense>

            {/* Alert */}
            <WmsDialogAlert type="show" open={alert} onClose={() => setAlert(false)}>
                {alertContent}
            </WmsDialogAlert>

            {/** 컴포넌트 전송 */}
            <Suspense>
                <ComponentSaveDialog
                    open={componentSaveDialog}
                    onClose={() => setComponentSaveDialog(false)}
                    component={component}
                />
            </Suspense>
        </>
    );
};

export default DeskingComponentButtonGroup;
