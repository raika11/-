import React, { useCallback, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextField, WmsDialogAlert } from '~/components';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 그룹 수정 다이얼로그
 * @param {object} props Props
 */
const CodeTypeUpdateDialog = (props) => {
    const { open, onClose, onSave, onDelete, setCodeTypeName, codeTypeId, codeTypeName } = props;
    const classes = useStyle();
    const [codeTypeNameError, setCodeTypeNameError] = useState(false);

    /**
     * 등록버튼 클릭
     */
    const handleSave = useCallback(() => {
        if (!onSave()) {
            setCodeTypeNameError(true);
        } else {
            onClose();
        }
    }, [onClose, onSave]);

    /**
     * 값 변경을 위한 func
     * @param {*} e
     */
    const handleChange = (e) => {
        setCodeTypeName(e.target.value);
    };

    return (
        <WmsDialogAlert
            open={open}
            onClose={onClose}
            title="그룹 수정"
            maxWidth="sm"
            buttons={[
                { name: '저장', color: 'primary', onClick: handleSave },
                { name: '취소', color: 'default', onClick: onClose },
                { name: '삭제', color: 'default', onClick: onDelete }
            ]}
        >
            <div className={classes.popupBody}>
                <WmsTextField
                    label="코드그룹"
                    labelWidth="70"
                    overrideClassName={classes.mb8}
                    name="codeTypeId"
                    value={codeTypeId}
                    disabled
                />
                <WmsTextField
                    placeholder="ID"
                    label="코드그룹명"
                    labelWidth="70"
                    name="codeTypeName"
                    value={codeTypeName}
                    required
                    onChange={handleChange}
                    error={codeTypeNameError}
                />
            </div>
        </WmsDialogAlert>
    );
};

export default withRouter(CodeTypeUpdateDialog);
