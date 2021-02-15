import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { MokaInputLabel, MokaInput, MokaIcon } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearReporter, getReporter, changeReporter, saveReporter } from '@store/reporter';
import toast, { messageBox } from '@utils/toastUtil';
// import bg from '@assets/images/v_noimg.jpg';

/**
 * 기자 정보 조회/수정
 */
const ReporterEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { repSeq: paramSeq } = useParams();
    const reporter = useSelector(({ reporter }) => reporter.reporter);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [temp, setTemp] = useState({});

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, checked } = target;
        setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
    };

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
                callback: ({ header }) => {
                    header.success ? toast.success(header.message) : messageBox.alert(header.message);
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

        if (paramSeq) {
            updateReporter({
                ...reporter,
                usedYn: temp.usedYn,
                talkYn: temp.talkYn,
            });
        }
    };

    /**
     * 취소
     */
    const handleClickCancle = () => {
        history.push(match.path);
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

    useEffect(() => {
        setTemp({
            ...reporter,
            usedYn: reporter.usedYn || 'N',
            talkYn: reporter.talkYn || 'N',
            rMail1: reporter.repEmail2 || ''.split('|')[0] || '',
            rMail2: reporter.repEmail2 || ''.split('|')[1] || '',
            rMail3: reporter.repEmail2 || ''.split('|')[2] || '',
            rMail4: reporter.repEmail2 || ''.split('|')[3] || '',
            modDt: reporter.modDt && reporter.modDt.length > 10 ? reporter.modDt.substr(0, 11) : reporter.modDt,
        });
    }, [reporter]);

    useEffect(() => {
        return () => {
            dispatch(clearReporter());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <hr className="divider mt-0" />

            <div className="d-flex align-items-center">
                {/* <Image width="100" height="100" src={temp.repImg || bg} className="flex-shrink-0" roundedCircle /> */}
                {temp.repImg ? (
                    <Image width="100" height="100" src={temp.repImg} className="flex-shrink-0" roundedCircle />
                ) : (
                    <MokaIcon
                        iconName="fas-user-circle"
                        className="gray-800"
                        style={{
                            fontSize: '100px',
                        }}
                    />
                )}

                <div className="flex-fill d-flex align-items-center justify-content-between ml-4">
                    <div className="d-flex flex-column">
                        <p className="mb-gutter">
                            <span className="h3 mr-1">{temp.repName}</span>
                            <span className="h3 font-weight-normal">기자</span>
                        </p>
                        <div className="d-flex">
                            <MokaInput
                                className="mr-gutter"
                                id="usedYn"
                                name="usedYn"
                                as="switch"
                                inputProps={{ label: '사용여부', checked: temp.usedYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                id="talkYn"
                                name="talkYn"
                                as="switch"
                                inputProps={{ label: '기자에게 한마디 사용여부', checked: temp.talkYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <Button variant="positive" className="mr-2" onClick={handleClickSave} disabled={inputDisabled}>
                            저장
                        </Button>
                        <Button variant="negative" onClick={handleClickCancle}>
                            취소
                        </Button>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center">
                <div className="flex-fill d-flex align-items-center justify-content-end ml-4">
                    <div className="d-flex align-items-center">최종 수정일: {temp.modDt}</div>
                </div>
            </div>

            <hr className="divider" />

            <Form>
                <Form.Row className="d-flex">
                    <div className="w-50">
                        <MokaInputLabel
                            label="이름"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.repName || '-'}
                            name="repName"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="소속 1"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.r1CdNm || '-'}
                            name="r1Cd"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="소속 3"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.r3CdNm || '-'}
                            name="r3Cd"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="타입코드"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.jplusRepDiv || '-'}
                            name="jplusRepDiv"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="중앙 ID"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.joinsId || '-'}
                            name="joinsId"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="페이스북"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.snsFb || '-'}
                            name="snsFb"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="인스타그램"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.snsIn || '-'}
                            name="snsIn"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                    </div>
                    <div className="w-50">
                        <MokaInputLabel
                            label="표시 직책"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.repTitle || '-'}
                            name="repTitle"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="소속 2"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.r2CdNm || '-'}
                            name="r2Cd"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="소속 4"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.r4CdNm || '-'}
                            name="r4Cd"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="집배신 이메일"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.repEmail1 || '-'}
                            name="repEmail1"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="분야"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.repField || '-'}
                            name="repField"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="트위터"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.snsTw || '-'}
                            name="snsTw"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="블로그"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.joinsBlog || '-'}
                            name="joinsBlog"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                    </div>
                </Form.Row>

                <MokaInputLabel
                    label="JNET ID"
                    labelWidth={110}
                    inputProps={{ plaintext: true, readOnly: true }}
                    value={temp.jnetId || '-'}
                    name="jnetId"
                    className="mb-2"
                    labelClassName="ml-0"
                />

                <Form.Row className="d-flex">
                    <div className="w-50">
                        <MokaInputLabel
                            label="JNET 이메일1"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.rMail1 || '-'}
                            name="repEmail1"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="JNET 이메일3"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.rMail3 || '-'}
                            name=""
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                    </div>
                    <div className="w-50">
                        <MokaInputLabel
                            label="JNET 이메일2"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.rMail2 || '-'}
                            name="repEmail2"
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                        <MokaInputLabel
                            label="JNET 이메일4"
                            labelWidth={110}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={temp.rMail4 || '-'}
                            name=""
                            className="mb-2"
                            labelClassName="ml-0"
                        />
                    </div>
                </Form.Row>

                <MokaInputLabel as="none" className="mb-2" label="기자 한마디" labelClassName="ml-0" />
                <MokaInput as="textarea" value={temp.repTalk} readOnly rows={3} className="resize-none bg-white p-3" />
            </Form>
        </>
    );
};

export default ReporterEdit;
