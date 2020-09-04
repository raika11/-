import React, { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextField, WmsDialogAlert } from '~/components';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 그룹추가 다이얼로그
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈함수
 * @param {func} props.onSave 저장함수
 */
const CodeTypeAddDialog = (props) => {
    const { open, onClose, onSave } = props;
    const classes = useStyle();

    const [codeTypeId, setCodeTypeId] = useState('');
    const [codeTypeName, setCodeTypeName] = useState('');
    const [codeTypeIdError, setCodeTypeIdError] = useState(false);
    const [codeTypeNameError, setCodeTypeNameError] = useState(false);

    /**
     * value 변경을 위한 func
     * @param {*} e
     */
    const handleChange = (e) => {
        if (e.target.name === 'codeTypeId') {
            setCodeTypeId(e.target.value);
        } else {
            setCodeTypeName(e.target.value);
        }
    };

    /**
     *  입력된 코드그룹아이디와, 코드그룹명에 대한 validate체크
     * @param {} targetObj
     */
    const validate = (targetObj) => {
        let totErr = [];

        if (!/^[A-Za-z0-9_-`/]+$/g.test(targetObj.codeTypeId)) {
            let err = {
                field: 'codeTypeId',
                reason: '코드그룹아이디를 확인해주세요'
            };
            totErr.push(err);
            setCodeTypeIdError(true);
        }
        if (!/[^\s\t\n]+/g.test(targetObj.codeTypeName)) {
            let err = {
                field: 'codeTypeName',
                reason: '코드그룹명을 확인해주세요'
            };
            totErr.push(err);
            setCodeTypeNameError(true);
        }
        if (totErr.length < 1) {
            return true;
        }
        return false;
    };

    /**
     * 저장
     */
    const handleSave = useCallback(() => {
        const createCodeType = {
            codeTypeId,
            codeTypeName
        };
        if (validate(createCodeType)) {
            onSave(createCodeType);
            onClose();
        }
    }, [codeTypeId, codeTypeName, onClose, onSave]);

    return (
        <WmsDialogAlert
            open={open}
            onClose={onClose}
            title="그룹 추가"
            type="alert"
            maxWidth="sm"
            buttons={[
                { name: '저장', color: 'primary', onClick: handleSave },
                { name: '취소', color: 'default', onClick: onClose }
            ]}
        >
            <div className={classes.popupBody}>
                <WmsTextField
                    placeholder="코드그룹아이디(영문으로 작성하세요)"
                    label="코드그룹"
                    labelWidth="70"
                    overrideClassName={classes.mb8}
                    name="codeTypeId"
                    value={codeTypeId}
                    onChange={handleChange}
                    required
                    error={codeTypeIdError}
                />

                <WmsTextField
                    placeholder="코드그룹명"
                    label="코드그룹명"
                    labelWidth="70"
                    name="codeTypeName"
                    value={codeTypeName}
                    onChange={handleChange}
                    required
                    error={codeTypeNameError}
                />
            </div>
        </WmsDialogAlert>
    );
};

export default withRouter(CodeTypeAddDialog);
