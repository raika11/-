import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { MokaInputLabel, MokaInput } from '@components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { clearReporter, getReporter, changeReporter, GET_REPORTER, CHANGE_REPORTER, saveReporter } from '@store/reporter';
import toast from '@utils/toastUtil';
import bg from '@assets/images/v_noimg.jpg';
import Col from 'react-bootstrap/Col';

/**
 * 기자 정보 조회/수정
 */
const ReporterEdit = () => {
    const dispatch = useDispatch();
    const { repSeq: paramSeq } = useParams();

    // use
    const [inputDisabled, setInputDisabled] = useState(true);

    // entity
    // eslint-disable-next-line no-unused-vars
    const [repSeq, setRepSeq] = useState('');
    const [usedYn, setUsedYn] = useState('N');
    const [talkYn, setTalkYn] = useState('N');
    const [repName, setRepName] = useState('');
    const [repEmail1, setRepEmail1] = useState('');
    const [repEmail2, setRepEmail2] = useState('');

    const [rMail1, setRMail1] = useState('');
    const [rMail2, setRMail2] = useState('');
    const [rMail3, setRMail3] = useState('');
    const [rMail4, setRMail4] = useState('');

    const [repTitle, setRepTitle] = useState('');
    const [joinsId, setJoinsId] = useState('');
    const [jnetId, setJnetId] = useState('');
    const [repPhoto, setRepPhoto] = useState('');
    const [repImg, setRepImg] = useState('');
    const [snsTw, setSnsTw] = useState('');
    const [snsFb, setSnsFb] = useState('');
    const [snsIn, setSnsIn] = useState('');
    const [joinsBlog, setJoinsBlog] = useState('');
    const [jplusRepDiv, setJplusRepDiv] = useState('');
    const [r1CdNm, setR1CdNm] = useState('');
    const [r2CdNm, setR2CdNm] = useState('');
    const [r3CdNm, setR3CdNm] = useState('');
    const [r4CdNm, setR4CdNm] = useState('');
    const [repField, setRepField] = useState('');
    const [repTalk, setRepTalk] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [userTalk, setUserTalk] = useState('');

    // error
    // eslint-disable-next-line no-unused-vars
    const [repSeqError, setRepSeqError] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [usedYnError, setUsedYnError] = useState(false);
    // eslint-disable-next-line no-unused-vars
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
            setInputDisabled(false);
        } else {
            dispatch(clearReporter());
            setInputDisabled(true);
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
                        toast.success('수정하였습니다.');
                    } else {
                        toast.fail('실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 기자관리 내용 저장 이벤트
     * @param event 이벤트 객체
     */

    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const tmp = {
            ...reporter,
            //repSeq : repSeq,
            usedYn: usedYn,
            talkYn: talkYn,
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
        setRMail1(repEmail2.split('|')[0] || '');
        setRMail2(repEmail2.split('|')[1] || '');
        setRMail3(repEmail2.split('|')[2] || '');
        setRMail4(repEmail2.split('|')[3] || '');
        setRepTitle(reporter.repTitle || '');
        setJoinsId(reporter.joinsId || '');
        setJnetId(reporter.jnetId || '');
        if (reporter.repPhoto !== '' && reporter.repPhoto !== null && reporter.repPhoto) {
            setRepPhoto(reporter.repPhoto);
        } else {
            if (reporter.repImg !== '' && reporter.repImg !== null && reporter.repImg) {
                setRepPhoto(reporter.repImg);
            }
        }
        setRepImg(reporter.repImg || bg);
        setSnsTw(reporter.snsTw || '');
        setSnsFb(reporter.snsFb || '');
        setSnsIn(reporter.snsIn || '');
        setJoinsBlog(reporter.joinsBlog || '');
        setJplusRepDiv(reporter.jplusRepDiv || '');
        setR1CdNm(reporter.r1CdNm || '');
        setR2CdNm(reporter.r2CdNm || '');
        setR3CdNm(reporter.r3CdNm || '');
        setR4CdNm(reporter.r4CdNm || '');
        setRepField(reporter.repField || '');
        setRepTalk(reporter.repTalk || '');
        setUserTalk(reporter.userTalk || '');
    }, [rMail1, repEmail2, repPhoto, reporter]);

    return (
        <>
            <div className="mb-3 d-flex align-items-center">
                <Image width="100" height="100" src={repImg} roundedCircle />
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
                        <Button variant="positive" className="mr-05" onClick={handleClickSave} disabled={inputDisabled}>
                            저장
                        </Button>
                        {/* 2020-11-27 14:55 추후에 기능을 추가 할수 있어서 일단 주석 처리. */}
                        {/* <Button variant="negative" onClick={handleClickCancle} disabled={inputDisabled}>
                            취소
                        </Button> */}
                    </div>
                </div>
            </div>

            <hr />

            <Form className="px-4">
                <Form.Row className="d-flex justify-content-between">
                    <div>
                        <MokaInputLabel label="이름" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repName} name="repName" />
                        <MokaInputLabel label="소속 1" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r1CdNm} name="r1Cd" />
                        <MokaInputLabel label="소속 3" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r3CdNm} name="r3Cd" />
                        <MokaInputLabel label="타입코드" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={jplusRepDiv} name="jplusRepDiv" />
                        <MokaInputLabel label="중앙 ID" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={joinsId} name="joinsId" />
                        <MokaInputLabel label="페이스북" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={snsFb} name="snsFb" />
                        <MokaInputLabel label="인스타그램" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={snsIn} name="snsIn" />
                    </div>
                    <div>
                        <MokaInputLabel label="표시 직책" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repTitle} name="repTitle" />
                        <MokaInputLabel label="소속 2" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r2CdNm} name="r2Cd" />
                        <MokaInputLabel label="소속 4" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={r4CdNm} name="r4Cd" />
                        <MokaInputLabel label="집배신 이메일" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repEmail1} name="repEmail1" />
                        <MokaInputLabel label="분야" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={repField} name="repField" />
                        <MokaInputLabel label="트위터" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={snsTw} name="snsTw" />
                        <MokaInputLabel label="블로그" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={joinsBlog} name="joinsBlog" />
                    </div>
                </Form.Row>
                <MokaInputLabel label="JNET ID" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={jnetId} name="jnetId" />
                <Form.Row className="d-flex justify-content-between">
                    <div>
                        <MokaInputLabel label="JNET 이메일1" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={rMail1} name="repEmail1" />
                        <MokaInputLabel label="JNET 이메일3" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={rMail3} name="" />
                    </div>
                    <div>
                        <MokaInputLabel label="JNET 이메일2" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={rMail2} name="repEmail2" />
                        <MokaInputLabel label="JNET 이메일4" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value={rMail4} name="" />
                    </div>
                </Form.Row>
                <Form.Row className="d-flex justify-content-between">
                    <Col xs={2} className="p-1 mb-0 mr-2">
                        <Form.Label className={'text-right'} style={{ width: '100px', minwidth: '100px' }} htmlFor="none">
                            기자 한마디
                        </Form.Label>
                    </Col>
                    <Col xs={10} className="p-0">
                        <MokaInput as={'textarea'} className="resize-none" value={repTalk} inputProps={{ plaintext: true, readOnly: true, rows: '5' }} />
                    </Col>
                </Form.Row>
                {/* <MokaInputLabel
                    as="textarea"
                    label={
                        <>
                            <div className="" style={{ position: 'relative', padding: '0px 0px 80px' }}>
                                기자 한마디
                            </div>
                        </>
                    }
                    labelWidth={100}
                    inputProps={{ plaintext: true, readOnly: true, rows: '5' }}
                    value={repTalk}
                    name="repTalk"
                    className="resize-none"
                /> */}
            </Form>
        </>
    );
};

export default ReporterEdit;
