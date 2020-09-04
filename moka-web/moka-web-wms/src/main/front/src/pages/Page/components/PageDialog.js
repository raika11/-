import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import style from '~/assets/jss/pages/DialogStyle';
import WmsEditor from '~/components/WmsEditor';
import { WmsButton, WmsResizeDialog } from '~/components';
import { getRelationPage } from '~/stores/page/pageRelationPGStore';

const useStyle = makeStyles(style);

const PageDialog = (props) => {
    const classes = useStyle();
    const { selected, onClose } = props;
    const { edit, loading } = useSelector(({ pageRelationPGStore, loadingStore }) => ({
        edit: pageRelationPGStore.page,
        loading: loadingStore['pageRelationPGStore/GET_RELATION_PAGE']
    }));
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState('');
    const [expansion, setExpansion] = useState(false);

    // 페이지템플릿 조회
    useEffect(() => {
        if (selected.pageSeq) {
            dispatch(getRelationPage(selected.pageSeq));
        }
    }, [selected.pageSeq, dispatch]);

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
    // const onBlur = (value) => {
    //     dispatch(
    //         changeEdit({
    //             key: 'templateBody',
    //             value
    //         })
    //     );
    // };

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
        setDefaultValue(edit.pageBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit.pageBody]);

    // 등록버튼 클릭
    // const handleSave = useCallback(() => {
    //     dispatch(saveTemplate({ actions: [changeEditAll(edit)] }));
    //     onClose();
    // }, [onClose, dispatch, edit]);

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
                        // onBlur={onBlur}
                        loading={loading}
                        value={defaultValue}
                        header={false}
                    />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    {/* <WmsButton color="info" size="long" onClick={handleSave}>
                        저장
                    </WmsButton> */}
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        닫기
                    </WmsButton>
                </div>
            }
        />
    );
};

export default PageDialog;
