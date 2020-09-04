import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { saveDomain, duplicateCheck } from '~/stores/domain/domainStore';
import { getLang, getApi } from '~/stores/etccodeType/etccodeTypeStore';
import { ShowDialog, VolumeDialog, DeleteDialog } from '../dialog';
import {
    WmsTextField,
    WmsTextFieldIcon,
    WmsSelect,
    WmsButton,
    WmsRadioGroup,
    WmsSwitch
} from '~/components';
import style from '~/assets/jss/pages/Domain/DomainStyle';

const useStyle = makeStyles(style);

/**
 * 도메인폼
 */
const DomainForm = () => {
    const classes = useStyle();
    const history = useHistory();
    const dispatch = useDispatch();
    const { detail, langRows, apiRows, latestMediaId } = useSelector((store) => ({
        detail: store.domainStore.detail,
        langRows: store.etccodeTypeStore.langRows,
        apiRows: store.etccodeTypeStore.apiRows,
        latestMediaId: store.authStore.latestMediaId
    }));
    const [loadCnt, setLoadCnt] = useState(0);
    const [disabled, setDisabled] = useState(true);

    // 도메인 state
    const [domainId, setDomainId] = useState('');
    const [volumeId, setVolumeId] = useState('');
    const [servicePlatform, setServicePlatform] = useState('P');
    const [lang, setLang] = useState('KR');
    const [domainName, setDomainName] = useState('');
    const [domainUrl, setDomainUrl] = useState('');
    const [useYn, setUseYn] = useState('Y');
    const [apiCodeId, setApiCodeId] = useState('');
    const [apiHost, setApiHost] = useState('');
    const [apiPath, setApiPath] = useState('');
    const [description, setDescription] = useState('');

    // 다이얼로그
    const [showOpen, setShowOpen] = useState(false);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [message, setMessage] = useState('');

    // validate
    const [domainErr, setDomainErr] = useState(false);
    const [domainNameErr, setDomainNameErr] = useState(false);
    const [domainUrlErr, setDomainUrlErr] = useState(false);
    const [volumeErr, setVolumeErr] = useState(false);

    useEffect(() => {
        if (loadCnt < 1) {
            dispatch(getLang());
            dispatch(getApi());
            setLoadCnt(loadCnt + 1);
        }
    }, [loadCnt, dispatch]);

    useEffect(() => {
        // 도메인 데이터 셋팅
        detail.domainId ? setDisabled(false) : setDisabled(true);
        setDomainId(detail.domainId || '');
        setVolumeId(detail.volumeId || '');
        setDomainName(detail.domainName || '');
        setServicePlatform(detail.servicePlatform || 'P');
        setLang(detail.lang || 'KR');
        setDomainUrl(detail.domainUrl || '');
        setUseYn(detail.useYn || 'Y');
        setApiCodeId(detail.apiCodeId || '');
        setApiHost(detail.apiHost || '');
        setApiPath(detail.apiPath || '');
        setDescription(detail.description || '');
    }, [detail]);

    const onChangeValue = (e) => {
        const { name, value, checked, selectedOptions } = e.target;
        if (name === 'domainId') {
            setDomainId(value);
            setDomainErr(false);
        } else if (name === 'servicePlatform') setServicePlatform(value);
        else if (name === 'lang') setLang(value);
        else if (name === 'domainName') {
            setDomainName(value);
            setDomainNameErr(false);
        } else if (name === 'domainUrl') {
            setDomainUrl(value);
            setDomainUrlErr(false);
        } else if (name === 'useYn') checked ? setUseYn('Y') : setUseYn('N');
        else if (name === 'api') {
            setApiCodeId(value);
            const { codeNameEtc1, codeNameEtc2 } = selectedOptions[0].dataset;
            setApiHost(codeNameEtc1);
            setApiPath(codeNameEtc2);
        } else if (name === 'description') setDescription(value);
    };

    /**
     * validate 함수
     */
    const validate = (domain) => {
        let invalidCnt = 0;

        // 도메인아이디체크
        if (!domain.domainId || domain.domainId === '') {
            setDomainErr(true);
            invalidCnt++;
        } else if (!/^\d{4}$/.test(domain.domainId)) {
            setDomainErr(true);
            invalidCnt++;
        }

        // 도메인명 체크
        if (!/[^\s\t\n]+/.test(domain.domainName)) {
            setDomainNameErr(true);
            invalidCnt++;
        }

        // 도메인url 체크
        if (!/[^\s\t\n]+/.test(domain.domainUrl)) {
            setDomainUrlErr(true);
            invalidCnt++;
        }

        // 볼륨체크
        if (!/[^\s\t\n]+/.test(domain.volumeId)) {
            setVolumeErr(true);
            invalidCnt++;
        }

        return invalidCnt < 1;
    };

    /**
     * 저장 버튼
     */
    const onSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tmp = {
            mediaId: latestMediaId,
            domainId,
            volumeId,
            domainName,
            servicePlatform,
            lang,
            domainUrl,
            useYn,
            apiHost,
            apiPath,
            description
        };
        if (validate(tmp)) {
            if (detail.domainId) {
                // 업데이트
                dispatch(saveDomain({ type: 'update', domain: tmp }));
            } else {
                // 추가
                dispatch(
                    duplicateCheck({
                        domainId,
                        unique: () =>
                            dispatch(
                                saveDomain({
                                    type: 'insert',
                                    domain: tmp,
                                    success: () => history.push(`/domain/${domainId}`)
                                })
                            ),
                        duplicate: () => {
                            setMessage('중복된 도메인아이디가 존재합니다');
                            setShowOpen(true);
                        }
                    })
                );
            }
        }
    };

    return (
        <>
            <div className={classes.formRoot}>
                <div className={clsx(classes.mb12, classes.inLine, classes.spaceBetween)}>
                    <WmsSwitch
                        label="서비스 여부"
                        labelWidth="80"
                        checked={useYn === 'Y' && true}
                        name="useYn"
                        onChange={onChangeValue}
                        required
                    />
                    <div className={classes.formButton}>
                        <WmsButton color="info" onClick={onSave}>
                            <span>저장</span>
                            <Icon>save</Icon>
                        </WmsButton>
                        <WmsButton color="del" disabled={disabled} onClick={() => setDelOpen(true)}>
                            <span>삭제</span>
                            <Icon>delete</Icon>
                        </WmsButton>
                    </div>
                </div>
                <div className={clsx(classes.mb12, classes.formStyle, classes.spaceBetween)}>
                    <WmsTextField
                        label="도메인 ID"
                        labelWidth="80"
                        placeholder="숫자 4자리로 입력하세요"
                        width="235"
                        name="domainId"
                        value={domainId}
                        onChange={onChangeValue}
                        disabled={detail.domainId && true}
                        error={domainErr}
                        required
                    />
                    <div className={clsx(classes.inLine, classes.spaceBetween)}>
                        <div className={classes.radioForm}>
                            <Typography
                                component="div"
                                variant="subtitle1"
                                className={classes.label}
                            >
                                플랫폼
                                <div className={classes.required}>*</div>
                            </Typography>
                            <WmsRadioGroup
                                values={['P', 'M']}
                                labels={['PC', '모바일']}
                                currentId={servicePlatform}
                                name="servicePlatform"
                                onChange={onChangeValue}
                            />
                        </div>
                        <WmsSelect
                            rows={langRows}
                            label="언어"
                            name="lang"
                            currentId={lang}
                            onChange={onChangeValue}
                            labelWidth="50"
                            width="150"
                        />
                    </div>
                </div>
                <div className={clsx(classes.mb12, classes.formStyle)}>
                    <WmsTextField
                        label="도메인명"
                        labelWidth="80"
                        overrideClassName={classes.mr37}
                        placeholder="도메인명을 입력하세요"
                        width="235"
                        name="domainName"
                        value={domainName}
                        onChange={onChangeValue}
                        error={domainNameErr}
                        required
                    />
                    <WmsTextField
                        label="도메인 주소"
                        labelWidth="80"
                        placeholder="도메인주소에서 http(s)://를 빼고 입력하세요"
                        width="380"
                        name="domainUrl"
                        value={domainUrl}
                        onChange={onChangeValue}
                        error={domainUrlErr}
                        required
                    />
                </div>
                <div className={clsx(classes.mb12, classes.inLine, classes.formStyle)}>
                    <WmsTextFieldIcon
                        label="볼륨"
                        labelWidth="80"
                        placeholder="볼륨을 선택해주세요"
                        overrideClassName={clsx(classes.volumeForm, classes.mr37)}
                        width="235"
                        value={volumeId}
                        icon="search"
                        error={volumeErr}
                        disabled
                        required
                        onIconClick={() => setVolumeOpen(true)}
                    />
                    <WmsSelect
                        label="API Host 경로"
                        labelWidth="80"
                        width="380"
                        name="api"
                        rows={apiRows}
                        currentId={apiCodeId}
                        onChange={onChangeValue}
                    />
                </div>
                <WmsTextField
                    overrideClassName={clsx(classes.inLine, classes.formStyle)}
                    multiline
                    rows={5}
                    label="메모"
                    labelWidth="80"
                    name="description"
                    value={description}
                    onChange={onChangeValue}
                />
            </div>

            {/** API검색 팝업 */}
            {volumeOpen && (
                <VolumeDialog
                    open={volumeOpen}
                    onClose={() => setVolumeOpen(false)}
                    volumeId={volumeId}
                    setVolumeId={setVolumeId}
                    setVolumeErr={setVolumeErr}
                />
            )}

            {/** 삭제 팝업 */}
            {delOpen && (
                <DeleteDialog
                    open={delOpen}
                    onClose={() => setDelOpen(false)}
                    domainId={domainId}
                    domainName={domainName}
                />
            )}

            {/** 확인 팝업 */}
            {showOpen && (
                <ShowDialog open={showOpen} onClose={() => setShowOpen(false)} message={message} />
            )}
        </>
    );
};

export default DomainForm;
