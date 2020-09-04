import React, { useState, useEffect } from 'react';
import { useHistory, withRouter, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { WmsCard, WmsTextField, WmsButton, WmsSwitch } from '~/components';
import style from '~/assets/jss/pages/Reserved/ReservedFormStyle';
import { changeLatestMediaId } from '~/stores/auth/authStore';
import {
    putReserved,
    changeEditAll,
    deleteReserved,
    getReserved,
    clearReserved
} from '~/stores/reserved/reservedStore';

/**
 * DatasetForm Style
 */
const useStyle = makeStyles(style);

const ReservedInfoContainer = () => {
    let history = useHistory();
    const classes = useStyle();
    const { reservedSeq: paramSeq } = useParams();
    const dispatch = useDispatch();
    const [reservedId, setReservedId] = useState('');
    const [reservedSeq, setReservedSeq] = useState('');
    const [reservedValue, setReservedValue] = useState('');
    const [useYn, setUseYn] = useState(false);
    const [description, setdescription] = useState('');
    const [mediaChangeCnt, setMediaChangeCnt] = useState(0);

    const { latestDomainId, reserved, latestMediaId } = useSelector(
        ({ reservedStore, authStore, loadingStore }) => ({
            reserved: reservedStore.reserved,
            latestDomainId: authStore.latestDomainId,
            // loading:
            //     loadingStore['reservedStore/GET_RESERVED'] ||
            //     loadingStore['reservedStore/DELETE_RESERVED'] ||
            //     loadingStore['reservedStore/PUT_RESERVED'],
            latestMediaId: authStore.latestMediaId
        })
    );

    const handleChange = (e) => {
        const targetName = e.target.name;
        if (targetName === 'reservedId') {
            setReservedId(e.target.value);
        } else if (targetName === 'reservedSeq') {
            setReservedSeq(e.target.value);
        } else if (targetName === 'reservedValue') {
            setReservedValue(e.target.value);
        } else if (targetName === 'description') {
            setdescription(e.target.value);
        }
    };
    useEffect(() => {
        setReservedId(reserved === null ? '' : reserved.reservedId);
        setReservedSeq(reserved === null ? '' : reserved.reservedSeq);
        setReservedValue(reserved === null ? '' : reserved.reservedValue);
        setdescription(
            reserved === null ? '' : reserved.description === undefined ? '' : reserved.description
        );
        setUseYn(reserved === null ? false : reserved.useYn === 'Y' && true);
    }, [reserved]);

    const [reservedIdError, setReservedIdError] = useState(false);
    const [reservedValueError, setReservedValueError] = useState(false);

    /**
     *  입력된 예약어 validate체크
     * @param {} targetObj
     */
    const validate = (targetObj) => {
        let totErr = [];

        if (!/^[a-zA-z]([A-Za-z0-9_-`/])+$/g.test(targetObj.reservedId)) {
            let err = {
                field: 'reservedId',
                reason: '예약어를 확인해주세요'
            };
            totErr.push(err);
            setReservedIdError(true);
        }

        if (!/[^\s\t\n]+/g.test(targetObj.reservedValue)) {
            let err = {
                field: 'reservedValue',
                reason: '예약어값을 확인해주세요'
            };
            totErr.push(err);
            setReservedValueError(true);
        }
        if (totErr.length < 1) {
            return true;
        }
        return false;
    };

    const onSave = () => {
        let newReserved = '';

        if (reservedSeq) {
            newReserved = {
                ...reserved,
                domainId: reserved.domain.domainId,
                reservedId,
                reservedValue,
                description,
                useYn
            };
        } else {
            newReserved = {
                domainId: latestDomainId,
                reservedId,
                reservedValue,
                description,
                useYn
            };
        }
        if (newReserved.useYn === true) {
            newReserved.useYn = 'Y';
        } else {
            newReserved.useYn = 'N';
        }

        if (validate(newReserved)) {
            dispatch(
                putReserved({
                    callback: () => history.push('/reserved'),
                    actions: [changeEditAll(newReserved)]
                })
            );
        }
    };

    const onDel = () => {
        const reservedSet = {
            domainId: latestDomainId,
            seq: reservedSeq
        };
        dispatch(deleteReserved({ callback: () => history.push('/reserved'), reservedSet }));
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

    const [paramState, setParamState] = useState(false);

    useEffect(() => {
        // 파라미터에 seq가 있는데 데이터가 없으면 조회
        let paramReservedSeq = Number(paramSeq);

        if (paramSeq && reservedSeq !== paramSeq && !paramState) {
            dispatch(getReserved(paramReservedSeq));
            setParamState(true);
        } else if (!paramSeq && reservedSeq) {
            dispatch(clearReserved({ reservedInfo: true }));
        }
    }, [dispatch, paramSeq, paramState, reservedSeq]);

    /**
     * 예약어SEQ 링크로 다이렉트 접속 시,
     * 예약어의 mediaId, domainId 정보로 latestMediaId, latestDomainId를 셋팅한다
     */
    useEffect(() => {
        if (mediaChangeCnt < 1 && reserved !== null) {
            if (reserved.domain.mediaId !== latestMediaId) {
                dispatch(
                    changeLatestMediaId({
                        mediaId: reserved.domain.mediaId,
                        domainId: reserved.domain.domainId
                    })
                );
                setMediaChangeCnt(mediaChangeCnt + 1);
            }
        }
    }, [dispatch, latestMediaId, mediaChangeCnt, reserved]);

    return (
        <>
            <WmsCard title="예약어 정보">
                <div className={classes.root}>
                    <div className={classes.container}>
                        <div
                            className={clsx(
                                classes.serviceForm,
                                classes.ml8,
                                classes.mr8,
                                classes.mb8
                            )}
                        >
                            <div className={classes.serviceWhether}>
                                <WmsSwitch
                                    label="사용 여부"
                                    labelWidth="70"
                                    checked={useYn}
                                    onChange={onChangeSwitchOn}
                                />
                            </div>
                            <div className="btnForm">
                                <WmsButton color="info" onClick={onSave}>
                                    <span>저장</span>
                                    <Icon>save</Icon>
                                </WmsButton>
                                <WmsButton color="del" onClick={onDel}>
                                    <span>삭제</span>
                                    <Icon>delete</Icon>
                                </WmsButton>
                            </div>
                        </div>
                        <div className={clsx(classes.lineForm, classes.ml8)}>
                            <WmsTextField
                                label="예약어"
                                labelWidth="75"
                                placeholder="예약어를 입력하세요."
                                width="370"
                                value=""
                                required
                                name="reservedId"
                                onChange={handleChange}
                                // eslint-disable-next-line react/jsx-no-duplicate-props
                                value={reservedId}
                                error={reservedIdError}
                            />
                        </div>
                        <div className={clsx(classes.lineForm, classes.ml8)}>
                            <WmsTextField
                                label="값"
                                labelWidth="75"
                                placeholder="값을 입력하세요"
                                width="370"
                                value=""
                                required
                                name="reservedValue"
                                onChange={handleChange}
                                // eslint-disable-next-line react/jsx-no-duplicate-props
                                value={reservedValue}
                                error={reservedValueError}
                            />
                        </div>
                        <div className={clsx(classes.lineForm, classes.ml8)}>
                            <WmsTextField
                                label="예약어 설명"
                                labelWidth="75"
                                placeholder="설명을 입력하세요"
                                width="752"
                                value=""
                                name="description"
                                onChange={handleChange}
                                // eslint-disable-next-line react/jsx-no-duplicate-props
                                value={description}
                            />
                        </div>
                    </div>
                </div>
            </WmsCard>
        </>
    );
};

export default withRouter(ReservedInfoContainer);
