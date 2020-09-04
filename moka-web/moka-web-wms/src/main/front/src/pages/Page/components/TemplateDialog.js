import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import style from '~/assets/jss/pages/DialogStyle';
import WmsEditor from '~/components/WmsEditor';
import { WmsButton, WmsResizeDialog } from '~/components';
import { getTemplate, changeTemplateBody, saveTemplate } from '~/stores/template/templateStore';

const useStyle = makeStyles(style);

const TemplateDialog = (props) => {
    const classes = useStyle();
    const { selected, onClose } = props;
    const { templateBody, loading } = useSelector((store) => ({
        templateBody: store.templateStore.templateBody,
        loading: store.loadingStore['templateStore/GET_TEMPLATE']
    }));
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState('');

    // 템플릿 조회
    useEffect(() => {
        if (selected.templateSeq) {
            dispatch(getTemplate({ templateSeq: selected.templateSeq }));
        }
    }, [selected.templateSeq, dispatch]);

    /**
     * 에디터 내용 변경
     * @param {string} value 변경값
     */
    const onBlur = (value) => {
        dispatch(changeTemplateBody(value));
    };

    useEffect(() => {
        setDefaultValue(templateBody);
    }, [templateBody]);

    // 등록버튼 클릭
    const handleSave = useCallback(() => {
        dispatch(saveTemplate());
        onClose();
    }, [onClose, dispatch]);

    return (
        <WmsResizeDialog
            open={selected.open}
            onClose={onClose}
            title={selected.title}
            width={838}
            height={870}
            content={
                <div className={clsx(classes.popupBody, classes.h100)}>
                    <WmsEditor
                        overrideRootClassName={clsx(classes.h100, classes.borderNone)}
                        title={selected.title}
                        language="html"
                        onBlur={onBlur}
                        loading={loading}
                        value={defaultValue}
                        header={false}
                    />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={handleSave}>
                        저장
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        닫기
                    </WmsButton>
                </div>
            }
        />
    );
};

export default TemplateDialog;
