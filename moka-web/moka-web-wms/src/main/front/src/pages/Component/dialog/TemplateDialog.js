import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsDraggableDialog } from '~/components';
import TemplateDialogSearch from './TemplateDialogSearch';
import TemplateDialogTable from './TemplateDialogTable';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 템플릿 다이얼로그
 * @param {boolean} props.open true | false
 * @param {func} props.onClose close함수
 * @param {func} props.setTemplateName 템플릿명 state 변경함수
 * @param {func} props.setTemplateSeq 템플릿아이디 state 변경함수
 * @param {func} props.setTemplateGroupName 템플릿 위치그룹명 state 변경함수
 * @param {func} props.setTemplateError 템플릿에러 state 변경함수
 */
const TemplateDialog = (props) => {
    const {
        open,
        onClose,
        setTemplateName,
        setTemplateSeq,
        setTemplateGroupName,
        setTemplateError
    } = props;
    const classes = useStyle();
    const [templateSeq, setLocalTemplateSeq] = useState('');
    const [templateGroupName, setLocalTemplateGroupName] = useState('');
    const [templateName, setLocalTemplateName] = useState('');

    /**
     * 등록 버튼
     */
    const onSave = () => {
        setTemplateSeq(templateSeq);
        setTemplateName(templateName);
        setTemplateGroupName(templateGroupName);
        setTemplateError(false);
        onClose();
    };

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="템플릿 검색"
            maxWidth="md"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <TemplateDialogSearch />
                    <TemplateDialogTable
                        templateSeq={templateSeq}
                        setTemplateSeq={setLocalTemplateSeq}
                        setTemplateName={setLocalTemplateName}
                        setTemplateGroupName={setLocalTemplateGroupName}
                    />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={onSave}>
                        등록
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        취소
                    </WmsButton>
                </div>
            }
        />
    );
};

export default TemplateDialog;
