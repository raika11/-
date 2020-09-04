import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import style from '~/assets/jss/pages/DialogStyle';
import WmsEditor from '~/components/WmsEditor';
import { WmsButton, WmsResizeDialog } from '~/components';
import {
    getTemplate,
    changeEdit,
    changeEditAll,
    saveTemplate
} from '~/stores/template/templateStore';

const useStyle = makeStyles(style);

const TemplateDialog = (props) => {
    const classes = useStyle();
    const { selected, onClose } = props;
    const { templateData, loading } = useSelector((store) => ({
        templateData: store.templateStore.detail,
        loading: store.loadingStore['templateStore/GET_TEMPLATE']
    }));
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState('');
    const [expansion, setExpansion] = useState(false);

    // 템플릿 조회
    useEffect(() => {
        if (selected.templateSeq) {
            dispatch(getTemplate({ templateSeq: selected.templateSeq }));
        }
    }, [selected.templateSeq, dispatch]);

    /**
     * 에디터 확장 콜백 함수
     * @param {boolean} ex 확장 여부
     */
    const onExpansion = (ex) => {
        if (ex) {
            // changeAllToggleState([false, true, false]);
            setExpansion(true);
        } else {
            // changeAllToggleState([true, true, true]);
            setExpansion(false);
        }
    };

    /**
     * 에디터 내용 변경
     * @param {string} value 변경값
     */
    const onBlur = (value) => {
        dispatch(
            changeEdit({
                key: 'templateBody',
                value
            })
        );
    };

    /**
     * width값에 따라 카드헤더의 확장 마크를 변경한다
     */
    // useEffect(() => {
    //     if (toggleState && !toggleState[0] && !toggleState[2]) {
    //         setExpansion(true);
    //     } else {
    //         setExpansion(false);
    //     }
    // }, [toggleState, expansion]);

    useEffect(() => {
        setDefaultValue(templateData.templateBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateData.templateBody]);

    // 등록버튼 클릭
    const handleSave = useCallback(() => {
        dispatch(saveTemplate({ actions: [changeEditAll(templateData)] }));
        onClose();
    }, [onClose, dispatch, templateData]);

    return (
        <WmsResizeDialog
            open={selected.open}
            onClose={onClose}
            title={selected.title}
            // maxWidth="lg"
            width={838}
            height={870}
            content={
                <div className={clsx(classes.popupBody, classes.h100)}>
                    <WmsEditor
                        overrideRootClassName={clsx(classes.h100, classes.borderNone)}
                        title={selected.title}
                        language="html"
                        expansion={expansion}
                        onExpansion={onExpansion}
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
