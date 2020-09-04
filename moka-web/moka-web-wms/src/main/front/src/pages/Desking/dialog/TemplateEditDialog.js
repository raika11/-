import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { WmsButton, WmsDraggableDialog } from '~/components';
import { putComponentWork } from '~/stores/desking/deskingStore';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

import TemplateEditSearch from './TemplateEditSearch';
import TemplateEditTable from './TemplateEditTable';

const useStyle = makeStyles(style);

/**
 * 템플릿 편집
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈함수
 * @param {object} props.component 컴포넌트데이터
 */
const TemplateEditDialog = (props) => {
    const { open, onClose, component } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { loading } = useSelector((store) => ({
        loading: store.loadingStore['deskingStore/PUT_COMPONENT_WORK']
    }));

    // state
    const [selected, setSelected] = useState('');

    const onSaveTrigger = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(
            putComponentWork({
                componentWorkSeq: component.seq,
                templateSeq: selected,
                callback: () => {
                    onClose();
                }
            })
        );
    };

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="템플릿 정보"
            width={656}
            scroll="body"
            loading={loading}
            content={
                <div className={classes.popupBody}>
                    <TemplateEditSearch component={component} classes={classes} />
                    <TemplateEditTable
                        component={component}
                        classes={classes}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={onSaveTrigger}>
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
export default TemplateEditDialog;
