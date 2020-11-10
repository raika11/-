import React, { useEffect, useState, state } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { clearReporter, getReporter, changeReporter, changeInvalidList, GET_REPORTER, CHANGE_REPORTER, saveReporter } from '@store/reporter';
import { notification } from '@utils/toastUtil';
import bg from '@assets/images/bg.jpeg';

/**
 * 기자 정보 조회/수정
 */
const ReporterEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { repSeq: paramSeq } = useParams();

    // entity
    const [repSeq, setRepSeq] = useState('');
    const [usedYn, setUsedYn] = useState('N');
    const [talkYn, setTalkYn] = useState('N');
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
        const { name, value, checked } = target;

        switch (name) {
            case 'repSeq':
                const regex = /^[0-9\b]+$/;
                if (value.length <= 4) {
                    setRepSeqError(false);
                    setRepSeq(value);
                }
                break;
            case 'usedYn':
                setUsedYn(checked ? 'Y' : 'N');
                setUsedYnError(false);
                break;
            case 'talkYn':
                setTalkYn(checked ? 'Y' : 'N');
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

        setRepSeq(reporter.repSeq || '');
        setUsedYn(reporter.usedYn || 'N');
        setTalkYn(reporter.talkYn || 'N');
        setRepName(reporter.repName || '');
        setRepEmail1(reporter.repEmail1 || '');
        setRepEmail2(reporter.repEmail2 || '');
        setRepTitle(reporter.repTitle || '');
        setRepPhone(reporter.repPhone || '');
        setJoinsId(reporter.joinsId || '');
        setJnetId(reporter.jnetId || '');
        setRepPhoto(reporter.repPhoto || '');
        setRepImg(reporter.repImg || '');
        setSnsTw(reporter.snsTw || '');
        setSnsFb(reporter.snsFb || '');
        setSnsIn(reporter.snsIn || '');
        setJoinsBlog(reporter.joinsBlog || '');
        setViewCnt(reporter.viewCnt || '');
        setArtCnt(reporter.artCnt || '');
        setScbCnt(reporter.scbCnt || '');
        setShrCnt(reporter.shrCnt || '');
        setReplyCnt(reporter.replyCnt || '');
        setJplusRepDiv(reporter.jplusRepDiv || '');
        setJplusJobInfo(reporter.jplusJobInfo || '');
        setJplusTitle(reporter.jplusTitle || '');
        setJplusMemo(reporter.jplusMemo || '');
        setJplusProfileYn(reporter.jplusProfileYn || '');
        setJplusRegDt(reporter.jplusRegDt || '');
        setJplusUsedYn(reporter.jplusUsedYn || '');
        setR1Cd(reporter.r1Cd || '');
        setR2Cd(reporter.r2Cd || '');
        setR3Cd(reporter.r3Cd || '');
        setR4Cd(reporter.r4Cd || '');
        setR5Cd(reporter.r5Cd || '');
        setR6Cd(reporter.r6Cd || '');
        setJamRepSeq(reporter.jamRepSeq || '');
        setJamDeptSeq(reporter.jamDeptSeq || '');
        setJamDeptNm(reporter.jamDeptNm || '');
        setRepField(reporter.repField || '');
        setJamComCd(reporter.jamComCd || '');
        setJamComNm(reporter.jamComNm || '');
        setRepTalk(reporter.repTalk || '');
        setUserTalk(reporter.userTalk || '');
    }, [reporter]);

    return (
        <>
            <div className="mb-3 d-flex align-items-center">
                <Image width="100" height="100" src={repPhoto} roundedCircle />
                <div className="w-100">
                    <div className="pb-4 d-flex justify-content-center">
                        <div className="d-flex">
                            <MokaInputLabel
                                label="사용여부"
                                className="mb-2"
                                id="usedYn"
                                name="usedYn"
                                placeholder="사용여부를 입력하세요"
                                as="switch"
                                inputProps={{ checked: usedYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </div>
                        <div className="d-flex">
                            <MokaInputLabel
                                label="기자에게 한마디 사용여부"
                                className="mb-2"
                                id="talkYn"
                                name="talkYn"
                                placeholder="기자에게 한마디 사용여부"
                                labelWidth={170}
                                as="switch"
                                inputProps={{ checked: talkYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="mr-05">
                            저장
                        </Button>
                        <Button variant="gray150">취소</Button>
                    </div>
                </div>
            </div>

            <hr />

            <Form className="px-4">
                <Form.Row className="d-flex justify-content-between">
                    <div>
                        <MokaInputLabel label="이름" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repName} name="repName" />
                        <MokaInputLabel label="소속 1" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r1Cd} name="r1Cd" />
                        <MokaInputLabel label="소속 3" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r3Cd} name="r3Cd" />
                        <MokaInputLabel label="타입코드" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={jplusRepDiv} name="jplusRepDiv" />
                        <MokaInputLabel label="중앙 ID" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={joinsId} name="joinsId" />
                        <MokaInputLabel label="페이스북" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={snsFb} name="snsFb" />
                        <MokaInputLabel label="인스타그램" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={snsIn} name="snsIn" />
                    </div>
                    <div>
                        <MokaInputLabel label="표시 직책" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repTitle} name="repTitle" />
                        <MokaInputLabel label="소속 2" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r2Cd} name="r2Cd" />
                        <MokaInputLabel label="소속 4" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r4Cd} name="r4Cd" />
                        <MokaInputLabel label="집배신 이메일" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repEmail1} name="repEmail1" />
                        <MokaInputLabel label="분야" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repField} name="repField" />
                        <MokaInputLabel label="트위터" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={snsTw} name="snsTw" />
                        <MokaInputLabel label="블로그" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={joinsBlog} name="joinsBlog" />
                    </div>
                </Form.Row>
                <MokaInputLabel label="JNET ID" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={jnetId} name="jnetId" />
                <Form.Row className="d-flex justify-content-between">
                    <div>
                        <MokaInputLabel label="JNET 이메일1" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repEmail1} name="repEmail1" />
                        {/*
                        <MokaInputLabel label="JNET 이메일3" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repName} name="" />
                        */}
                    </div>
                    <div>
                        <MokaInputLabel label="JNET 이메일2" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repEmail2} name="repEmail2" />
                        {/*
                        <MokaInputLabel label="JNET 이메일4" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repName} name="" />
                        */}
                    </div>
                </Form.Row>
                <MokaInputLabel label="기자 한마디" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repTalk} name="repTalk" />
            </Form>
        </>
    );
};

export default ReporterEdit;
