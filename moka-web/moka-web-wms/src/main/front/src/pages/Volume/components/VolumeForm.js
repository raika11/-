import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@material-ui/core';
import { WmsTextField, WmsSelect, WmsButton } from '~/components';
import { saveVolume } from '~/stores/volume/volumeStore';
import { getLang } from '~/stores/etccodeType/etccodeTypeStore';
import ShowDialog from '../dialog/ShowDialog';
import DeleteDialog from '../dialog/DeleteDialog';
import { VOLUME_BASE_PATH } from '~/constants';

const VOLUME_BASE_SOURCE = [
    { id: 'path', name: '이미지 경로' },
    { id: 'filesystem', name: 'filesystem' }
];

const VolumeForm = (props) => {
    const { classes } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { detail, langRows } = useSelector((store) => ({
        detail: store.volumeStore.detail,
        langRows: store.etccodeTypeStore.langRows
    }));
    const [loadCnt, setLoadCnt] = useState(0);
    const [disabled, setDisabled] = useState(true);

    // 볼륨 state
    const [volumeId, setVolumeId] = useState('');
    const [lang, setLang] = useState('KR');
    const [volumeName, setVolumeName] = useState('');
    const [volumePath, setVolumePath] = useState('');
    const [volumeSource, setVolumeSource] = useState('');

    // 다이얼로그
    const [showOpen, setShowOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [message, setMessage] = useState('');

    // validate
    const [volumeErr, setVolumeErr] = useState(false);
    const [volumeNameErr, setVolumeNameErr] = useState(false);
    const [volumePathErr, setVolumePathErr] = useState(false);

    // 로드시 한번만 불러올 데이터
    useEffect(() => {
        if (loadCnt < 1) {
            dispatch(getLang());
            setLoadCnt(loadCnt + 1);
        }
    }, [loadCnt, dispatch]);

    useEffect(() => {
        // 볼륨 데이터 셋팅
        detail.volumeId ? setDisabled(false) : setDisabled(true);
        setVolumeId(detail.volumeId || '');
        setLang(detail.lang || 'KR');
        setVolumeName(detail.volumeName || '');
        setVolumePath(detail.volumePath || '');
        setVolumeSource(detail.volumeSource || '');

        // error 제거
        setVolumeErr(false);
        setVolumeNameErr(false);
        setVolumePathErr(false);
    }, [detail]);

    // onChagne event
    const onChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'volumeId') {
            setVolumeId(value);
            setVolumeErr(false);
        }
        if (name === 'lang') setLang(value);
        else if (name === 'volumeName') {
            setVolumeName(value);
            setVolumeNameErr(false);
        } else if (name === 'volumePath') {
            setVolumePath(value);
            setVolumePathErr(false);
        } else if (name === 'volumeSource') {
            setVolumeSource(value);
        }
    };

    /**
     * validate 함수
     */
    const validate = (volume) => {
        let invalidCnt = 0;

        // 볼륨명 체크
        if (!/[^\s\t\n]+/.test(volume.volumeName)) {
            setVolumeNameErr(true);
            invalidCnt++;
        }

        // 볼륨패스 체크
        if (!/[^\s\t\n]+/.test(volume.volumePath)) {
            setVolumePathErr(true);
            invalidCnt++;
        }

        return invalidCnt < 1;
    };

    // onSave event
    const onSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tmp = {
            volumeId,
            lang,
            volumeName,
            volumePath,
            volumeSource
        };
        if (validate(tmp)) {
            if (detail.volumeId) {
                dispatch(saveVolume({ type: 'update', volume: tmp }));
            } else {
                dispatch(
                    saveVolume({
                        type: 'insert',
                        volume: tmp,
                        success: () => history.push(`volume/${volumeId}`)
                    })
                );
            }
        }
    };

    return (
        <>
            <div className={classes.formRoot}>
                <div className={classes.formButton}>
                    <WmsButton color="info" onClick={onSave}>
                        <span>저장</span>
                        <Icon>save</Icon>
                    </WmsButton>
                    <WmsButton
                        color="del"
                        disabled={disabled}
                        onClick={() => setDelOpen(true)}
                        overrideClassName={classes.p8}
                    >
                        <span>삭제</span>
                        <Icon>delete</Icon>
                    </WmsButton>
                </div>
                <div className={classes.mb12}>
                    <WmsTextField
                        label="볼륨 ID"
                        labelWidth="80"
                        width="368"
                        name="volumeId"
                        value={volumeId}
                        onChange={onChangeValue}
                        disabled
                        error={volumeErr}
                    />
                </div>
                <div className={classes.mb12}>
                    <WmsSelect
                        rows={langRows}
                        label="언어"
                        labelWidth="80"
                        width="368"
                        name="lang"
                        currentId={lang}
                        onChange={onChangeValue}
                    />
                </div>
                <div className={classes.mb12}>
                    <WmsTextField
                        label="볼륨 명"
                        labelWidth="80"
                        width="660"
                        placeholder="볼륨명을 넣어주세요"
                        name="volumeName"
                        value={volumeName}
                        onChange={onChangeValue}
                        error={volumeNameErr}
                    />
                </div>
                <div className={classes.mb12}>
                    <WmsTextField
                        label="볼륨 경로"
                        labelWidth="80"
                        width="368"
                        overrideClassName={classes.mr8}
                        name="volumeBasePath"
                        value={VOLUME_BASE_PATH}
                        disabled
                    />
                    <WmsTextField
                        labelWidth="80"
                        width="368"
                        placeholder="경로 입력해주세요"
                        name="volumePath"
                        value={volumePath}
                        onChange={onChangeValue}
                        error={volumePathErr}
                    />
                </div>
                <div>
                    <WmsSelect
                        rows={VOLUME_BASE_SOURCE}
                        label="볼륨 소스"
                        labelWidth="80"
                        width="660"
                        name="volumeSource"
                        currentId={volumeSource}
                        onChange={onChangeValue}
                    />
                </div>
            </div>

            {/** 확인 팝업 */}
            {showOpen && (
                <ShowDialog open={showOpen} onClose={() => setShowOpen(false)} message={message} />
            )}

            {/** 삭제 팝업 */}
            {delOpen && (
                <DeleteDialog
                    open={delOpen}
                    onClose={() => setDelOpen(false)}
                    volumeId={volumeId}
                    volumeName={volumeName}
                />
            )}
        </>
    );
};

export default VolumeForm;
