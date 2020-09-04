import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextField, WmsSwitch, WmsDialogAlert } from '~/components';
import style from '~/assets/jss/pages/DialogStyle';

const useStyle = makeStyles(style);

/**
 * 코드추가 다이얼로그
 */
const CodeAddDialog = (props) => {
    const { open, onClose, onSave, selectedCodeType } = props;
    const classes = useStyle();

    const [codeTypeName, setCodeTypeName] = useState(selectedCodeType.codeTypeName);
    const [codeId, setCodeId] = useState('');
    const [codeName, setCodeName] = useState('');
    const [codeOrder, setCodeOrder] = useState('');
    const [etcOne, setEtcOne] = useState('');
    const [etcTwo, setEtcTwo] = useState('');
    const [etcThree, setEtcThree] = useState('');
    const [useYn, setUseYn] = useState(false);

    const [codeIdError, setCodeIdError] = useState(false);
    const [codeNameError, setCodeNameError] = useState(false);
    const [codeOrderError, setCodeOrderError] = useState(false);
    const [setCodeUseYnError] = useState(false);

    /**
     * DB저장을 위한 Swich value 변경
     * @param {*} val
     */
    const changeSwitchValue = (val) => {
        if (val) {
            return 'Y';
        }
        return 'N';
    };

    /**
     * textfield 값 변경
     * @param {*} e
     */
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
        const createCode = {
            ...selectedCodeType,
            codeId,
            codeName,
            codeOrder,
            codeNameEtc1: etcOne,
            codeNameEtc2: etcTwo,
            codeNameEtc3: etcThree,
            useYn: changeSwitchValue(useYn)
        };

        if (validate(createCode)) {
            onSave(createCode);
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

    return (
        <WmsDialogAlert
            open={open}
            onClose={onClose}
            title="코드 추가"
            maxWidth="md"
            type="alert"
            buttons={[
                { name: '등록', color: 'primary', onClick: handleOnSave },
                { name: '취소', color: 'default', onClick: onClose }
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

export default withRouter(CodeAddDialog);
