import React, { useEffect, useState, Suspense } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { TramOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextField, WmsButton, WmsResizeDialog } from '~/components';
import WmsEditor from '~/components/WmsEditor';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';
import { API_BASE_URL } from '~/constants';
import { putComponentWork } from '~/stores/desking/deskingStore';

const ComponentSaveDialog = React.lazy(() => import('../dialog/ComponentSaveDialog'));
const useStyle = makeStyles(style);

const HtmlEditDialog = (props) => {
    const { open, onClose, component } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const paramSeq = Number(match.params.pageSeq);
    const { content, loading } = useSelector(({ mergeStore, loadingStore }) => ({
        content: mergeStore.content,
        loading: loadingStore['mergeStore/PREVIEW_COMPONENT']
    }));
    const [componentSaveDialog, setComponentSaveDialog] = useState(false);
    // 원본 워크컴포넌트 스냅샷 정보
    const [orgSnapshotYn] = useState(component.snapshotYn);
    const [orgSnapshotBody] = useState(component.snapshotBody);
    // 팝업이후 변경되는 워크컴포넌트 스냅샷 정보
    const [snapshotYn, setSnapshoYn] = useState(component.snapshotYn);
    const [snapshotBody, setSnapshotBody] = useState(component.snapshotBody);

    // 저장 후 반영
    const handleSave = () => {
        const option = {
            componentWorkSeq: component.seq,
            snapshotYn: 'Y',
            snapshotBody,
            callback: (result) => {
                if (result) {
                    setComponentSaveDialog(true);
                }
            }
        };
        dispatch(putComponentWork(option));
    };

    // 팝업저장 다이얼로그 종료
    const handleComponentSaveDialog = (isSave) => {
        setComponentSaveDialog(false);
        if (isSave) {
            onClose(); // 전송한 경우, 스냅샷다이얼로그도 종료
        }
    };

    // 미리보기
    const handleCPreviewClicked = () => {
        // HTML을 work에 저장 후 미리보기
        const option = {
            componentWorkSeq: component.seq,
            snapshotYn: 'Y',
            snapshotBody,
            callback: (result) => {
                if (result) {
                    setSnapshoYn('Y');
                    // eslint-disable-next-line max-len
                    const url = `${API_BASE_URL}/preview/desking/component?pageSeq=${paramSeq}&componentWorkSeq=${component.seq}`;
                    window.open(url, '컴포넌트 미리보기');
                }
            }
        };
        dispatch(putComponentWork(option));
    };

    /**
     * 에디터 내용 변경
     * @param {string} value 변경값
     */
    const onBlur = (value) => {
        setSnapshotBody(value);
    };

    // 종료
    const handleClose = () => {
        // 원본과 스냅샷정보 다를 경우 원복
        if (orgSnapshotYn !== snapshotYn) {
            const option = {
                componentWorkSeq: component.seq,
                snapshotYn: orgSnapshotYn,
                snapshotBody: orgSnapshotBody
            };
            dispatch(putComponentWork(option));
        }
        onClose();
    };

    return (
        <>
            <WmsResizeDialog
                open={open}
                onClose={onClose}
                title="HTML 수동 편집"
                width={706}
                height={771}
                content={
                    <div className={clsx(classes.popupBody, classes.h100)}>
                        <div className={classes.mb8}>
                            <WmsTextField
                                label="컴포넌트명"
                                labelWidth={70}
                                value={component.componentName}
                                fullWidth
                            />
                        </div>
                        <div className={classes.editor}>
                            <WmsEditor
                                header={false}
                                overrideRootClassName={classes.h100}
                                // title={title}
                                language="html"
                                // expansion={expansion}
                                // onExpansion={onExpansion}
                                onBlur={onBlur}
                                loading={loading}
                                value={content}
                                // header={false}
                            />
                        </div>
                    </div>
                }
                actions={
                    <div className={classes.popupFooter}>
                        <WmsButton color="info" size="long" onClick={handleSave}>
                            저장후반영
                        </WmsButton>
                        <WmsButton color="wolf" size="long" onClick={handleCPreviewClicked}>
                            미리보기
                        </WmsButton>
                        <WmsButton color="wolf" size="long" onClick={handleClose}>
                            닫기
                        </WmsButton>
                    </div>
                }
            />
            {/** 컴포넌트 전송 */}
            <Suspense>
                <ComponentSaveDialog
                    open={componentSaveDialog}
                    onClose={handleComponentSaveDialog}
                    component={component}
                />
            </Suspense>
        </>
    );
};
export default HtmlEditDialog;
