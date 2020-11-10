import React, { useEffect, useState, state } from 'react';
import { Col, Form, Button, Row } from 'react-bootstrap';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { clearReporter, getReporter, changeReporter, changeInvalidList, GET_REPORTER, CHANGE_REPORTER, saveReporter } from '@store/reporter';
import { notification } from '@utils/toastUtil';

/**
 * 기자관리 상세|수정
 * @param history rect-router-dom useHisotry
 */

const ReporterMgrEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { repSeq: paramSeq } = useParams();

    // entity
    const [repSeq, setRepSeq] = useState('');
    const [usedYn, setUsedYn] = useState('');
    const [talkYn, setTalkYn] = useState('');
    const [repName, setRepName] = useState('');
    const [repEmail1, setRepEmail1] = useState('');
    const [repEmail2, setRepEmail2] = useState('');
    const [repTitle, setRepTitle] = useState('');
    const [repPhone, setRepPhone] = useState('');
    const [joinsId, setJoinsId] = useState('');
    const [jnetId, setJnetId] = useState('');
    const [repPhoto, setRepPhoto] = useState('');
    const [repImg, setRepImg] = useState('');
    const [snsTw, setSnsTw] = useState('');
    const [snsFb, setSnsFb] = useState('');
    const [snsIn, setSnsIn] = useState('');
    const [joinsBlog, setJoinsBlog] = useState('');
    const [viewCnt, setViewCnt] = useState('');
    const [artCnt, setArtCnt] = useState('');
    const [scbCnt, setScbCnt] = useState('');
    const [shrCnt, setShrCnt] = useState('');
    const [replyCnt, setReplyCnt] = useState('');
    const [jplusRepDiv, setJplusRepDiv] = useState('');
    const [jplusJobInfo, setJplusJobInfo] = useState('');
    const [jplusTitle, setJplusTitle] = useState('');
    const [jplusMemo, setJplusMemo] = useState('');
    const [jplusProfileYn, setJplusProfileYn] = useState('');
    const [jplusRegDt, setJplusRegDt] = useState('');
    const [jplusUsedYn, setJplusUsedYn] = useState('');
    const [r1Cd, setR1Cd] = useState('');
    const [r2Cd, setR2Cd] = useState('');
    const [r3Cd, setR3Cd] = useState('');
    const [r4Cd, setR4Cd] = useState('');
    const [r5Cd, setR5Cd] = useState('');
    const [r6Cd, setR6Cd] = useState('');
    const [jamRepSeq, setJamRepSeq] = useState('');
    const [jamDeptSeq, setJamDeptSeq] = useState('');
    const [jamDeptNm, setJamDeptNm] = useState('');
    const [repField, setRepField] = useState('');
    const [jamComCd, setJamComCd] = useState('');
    const [jamComNm, setJamComNm] = useState('');
    const [repTalk, setRepTalk] = useState('');
    const [userTalk, setUserTalk] = useState('');

    // error
    const [repSeqError, setRepSeqError] = useState(false);
    const [usedYnError, setUsedYnError] = useState(false);
    const [talkYnError, setTalkYnError] = useState(false);

    // getter
    const { reporter, invalidList } = useSelector(
        (store) => {
            return {
                reporter: store.reporter.reporter,
                invalidList: store.group.invalidList,
                loading: store.loading[GET_REPORTER] || store.loading[CHANGE_REPORTER],
            };
        },

        shallowEqual,
    );

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        switch (name) {
            case 'repSeq':
                const regex = /^[0-9\b]+$/;
                if (value.length <= 4) {
                    setRepSeqError(false);
                    setRepSeq(value);
                }
                break;
            case 'usedYn':
                setUsedYn(value);
                setUsedYnError(false);
                break;
            case 'talkYn':
                setTalkYn(value);
                setTalkYnError(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (paramSeq) {
            dispatch(getReporter(paramSeq));
        } else {
            dispatch(clearReporter());
        }
    }, [dispatch, paramSeq]);

    /**
     * group 수정
     * @param {object} tmp 도메인
     */

    const updateReporter = (tmp) => {
        dispatch(
            saveReporter({
                type: 'update',
                actions: [
                    changeReporter({
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * group 저장 이벤트
     * @param event 이벤트 객체
     */

    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const tmp = {
            repSeq,
            usedYn,
            talkYn,
        };

        if (paramSeq) {
            updateReporter(tmp);
        }
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'repSeq') {
                    setRepSeqError(true);
                }
                if (i.field === 'usedYn') {
                    setUsedYnError(true);
                }
                if (i.field === 'talkYn') {
                    setTalkYnError(true);
                }
            });
        }
    }, [invalidList]);

    // setter 도메인 데이터 셋팅
    useEffect(() => {
        setRepSeqError(false);
        setUsedYnError(false);
        setTalkYnError(false);

        setRepSeq(repSeq || '');
        setUsedYn(usedYn || '');
        setTalkYn(talkYn || '');
        setRepName(repName || '');
        setRepEmail1(repEmail1 || '');
        setRepEmail2(repEmail2 || '');
        setRepTitle(repTitle || '');
        setRepPhone(repPhone || '');
        setJoinsId(joinsId || '');
        setJnetId(jnetId || '');
        setRepPhoto(repPhoto || '');
        setRepImg(repImg || '');
        setSnsTw(snsTw || '');
        setSnsFb(snsFb || '');
        setSnsIn(snsIn || '');
        setJoinsBlog(joinsBlog || '');
        setViewCnt(viewCnt || '');
        setArtCnt(artCnt || '');
        setScbCnt(scbCnt || '');
        setShrCnt(shrCnt || '');
        setReplyCnt(replyCnt || '');
        setJplusRepDiv(jplusRepDiv || '');
        setJplusJobInfo(jplusJobInfo || '');
        setJplusTitle(jplusTitle || '');
        setJplusMemo(jplusMemo || '');
        setJplusProfileYn(jplusProfileYn || '');
        setJplusRegDt(jplusRegDt || '');
        setJplusUsedYn(jplusUsedYn || '');
        setR1Cd(r1Cd || '');
        setR2Cd(r2Cd || '');
        setR3Cd(r3Cd || '');
        setR4Cd(r4Cd || '');
        setR5Cd(r5Cd || '');
        setR6Cd(r6Cd || '');
        setJamRepSeq(jamRepSeq || '');
        setJamDeptSeq(jamDeptSeq || '');
        setJamDeptNm(jamDeptNm || '');
        setRepField(repField || '');
        setJamComCd(jamComCd || '');
        setJamComNm(jamComNm || '');
        setRepTalk(repTalk || '');
        setUserTalk(userTalk || '');
    }, [
        artCnt,
        jamComCd,
        jamComNm,
        jamDeptNm,
        jamDeptSeq,
        jamRepSeq,
        jnetId,
        joinsBlog,
        joinsId,
        jplusJobInfo,
        jplusMemo,
        jplusProfileYn,
        jplusRegDt,
        jplusRepDiv,
        jplusTitle,
        jplusUsedYn,
        r1Cd,
        r2Cd,
        r3Cd,
        r4Cd,
        r5Cd,
        r6Cd,
        repEmail1,
        repEmail2,
        repField,
        repImg,
        repName,
        repPhone,
        repPhoto,
        repSeq,
        repTalk,
        repTitle,
        replyCnt,
        reporter.repSeq,
        scbCnt,
        shrCnt,
        snsFb,
        snsIn,
        snsTw,
        talkYn,
        usedYn,
        userTalk,
        viewCnt,
    ]);

    return (
        <MokaCard title="기자정보" width={1000}>
            <Form noValidate>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel className="mb-0" label="컴포넌트ID" inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="p-0 d-flex justify-content-between">
                        <div className="d-flex">
                            <Button variant="primary" className="mr-2">
                                저장
                            </Button>
                            <Button variant="danger">취소</Button>
                        </div>
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default ReporterMgrEdit;
