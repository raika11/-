import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextField, WmsSwitch, WmsDialogAlert } from '~/components';
import style from '~/assets/jss/pages/DialogStyle';

const useStyle = makeStyles(style);

/**
 * 코드수정 다이얼로그
 */
const CodeUpdateDialog = (props) => {
    const classes = useStyle();
    const { open, onClose, onSave, onDelete, code } = props;

    const [codeTypeName, setCodeTypeName] = useState(code.codeTypeName);
    const [codeId, setCodeId] = useState(code.codeId);
    const [codeName, setCodeName] = useState(code.codeName);
    const [codeOrder, setCodeOrder] = useState(code.codeOrder);
    const [etcOne, setEtcOne] = useState(code.etcOne);
    const [etcTwo, setEtcTwo] = useState(code.etcTwo);
    const [etcThree, setEtcThree] = useState(code.etcThree);
    const [useYn, setUseYn] = useState(code.useYn);

    /**
     * 화면에 보여주기 위해  swich 값 변경
     * @param {*} val
     */
    const changeSwitchValue = (val) => {
        if (val === true) {
            return 'Y';
        }
        return 'N';
    };

    useEffect(() => {
        if (code.useYn === 'Y') {
            setUseYn(true);
        } else {
            setUseYn(false);
        }
    }, [code.useYn]);

    const handleChange = (e) => {
        const targetName = e.target.name;

        if (targetName === 'codeTypeName') {
            setCodeTypeName(e.target.value);
        } else if (targetName === 'codeId') {
            setCodeId(e.target.value);
        } else if (targetName === 'codeName') {
            setCodeName(e.target.value);
        } else if (targetName === 'codeOrder') {
            setCodeOrder(e.target.value);
        } else if (targetName === 'etcOne') {
            setEtcOne(e.target.value);
        } else if (targetName === 'etcTwo') {
            setEtcTwo(e.target.value);
        } else if (targetName === 'etcThree') {
            setEtcThree(e.target.value);
        } else if (targetName === 'useYn') {
            setUseYn(e.target.value);
        }
    };

    const [codeIdError, setCodeIdError] = useState(false);
    const [codeNameError, setCodeNameError] = useState(false);
    const [codeOrderError, setCodeOrderError] = useState(false);
    const [setCodeUseYnError] = useState(false);

    /**
     *  입력된 코드그룹아이디와, 코드그룹명에 대한 validate체크
     * @param {} targetObj
     */
    const validate = (targetObj) => {
        let totErr = [];

        if (!/^[A-Za-z0-9_-`/]+$/g.test(targetObj.codeId)) {
            let err = {
                field: 'codeId',
                reason: '코드아이디를 확인해주세요'
            };
            totErr.push(err);
            setCodeIdError(true);
        }
        if (!/[^\s\t\n]+/g.test(targetObj.codeName)) {
            let err = {
                field: 'codeTypeId',
                reason: '코드그룹명을 확인해주세요'
            };
            totErr.push(err);
            setCodeNameError(true);
        }
        if (!/[^\s\t\n]+/g.test(targetObj.codeOrder)) {
            let err = {
                field: 'order',
                reason: '순서를 확인해주세요'
            };
            totErr.push(err);
            setCodeOrderError(true);
        }
        if (!/[^\s\t\n]+/g.test(targetObj.useYn)) {
            let err = {
                field: 'codeTypeId',
                reason: '코드그룹명을 확인해주세요'
            };
            totErr.push(err);
            setCodeUseYnError(true);
        }
        if (totErr.length < 1) {
            return true;
        }
        return false;
    };

    /**
     * 저장
     */
    const handleOnSave = () => {
        const updateCode = {
            ...code,
            codeId,
            codeName,
            codeOrder,
            codeNameEtc1: etcOne,
            codeNameEtc2: etcTwo,
            codeNameEtc3: etcThree,
            useYn: changeSwitchValue(useYn)
        };
        if (validate(updateCode)) {
            onSave(updateCode);
            onClose();
        }
    };

    /**
     * 사용여부 스위치 온오프
     */
    const onChangeSwitchOn = () => {
        if (useYn) {
            // 스위치오프
            setUseYn(false);
        } else {
            // 스위치온
            setUseYn(true);
        }
    };

    const handleOnDelete = () => {
        onDelete(code.seq);
        onClose();
    };
    return (
        <WmsDialogAlert
            open={open}
            onClose={onClose}
            title="코드 수정"
            maxWidth="md"
            buttons={[
                { name: '수정', color: 'primary', onClick: handleOnSave },
                { name: '취소', color: 'default', onClick: onClose },
                { name: '삭제', color: 'default', onClick: handleOnDelete }
            ]}
        >
            <div className={classes.popupBody}>
                <WmsTextField
                    label="코드그룹"
                    labelWidth="70"
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="codeTypeName"
                    value={codeTypeName}
                    disabled
                />
                <WmsTextField
                    label="코드"
                    labelWidth="70"
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="codeId"
                    value={codeId}
                    error={codeIdError}
                    disabled
                />
                <WmsTextField
                    label="코드명"
                    labelWidth="70"
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="codeName"
                    value={codeName}
                    error={codeNameError}
                />
                <WmsTextField
                    label="순서"
                    labelWidth="70"
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="codeOrder"
                    value={codeOrder}
                    error={codeOrderError}
                />

                <WmsSwitch
                    label="사용 여부"
                    labelWidth="70"
                    checked={useYn}
                    onChange={onChangeSwitchOn}
                />

                <WmsTextField
                    label="기타1"
                    labelWidth="70"
                    multiline
                    rows={3}
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="etcOne"
                    value={etcOne}
                />
                <WmsTextField
                    label="기타2"
                    labelWidth="70"
                    multiline
                    rows={3}
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="etcTwo"
                    value={etcTwo}
                />
                <WmsTextField
                    label="기타3"
                    labelWidth="70"
                    multiline
                    rows={3}
                    width="395"
                    overrideClassName={classes.mb8}
                    onChange={handleChange}
                    name="etcThree"
                    value={etcThree}
                />
            </div>
        </WmsDialogAlert>
    );
};

export default withRouter(CodeUpdateDialog);
