import React, { useEffect, useState } from 'react';
import { Form, Button, Image, Col } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaInputLabel, MokaInput, MokaIcon } from '@components';
import { clearReporter, getReporter, saveReporter } from '@store/reporter';
import toast, { messageBox } from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';

const ReporterInput = ({ label, value }) => (
    <div className="d-flex align-items-center h-100">
        <MokaInputLabel label={label} as="none" />
        <div className="flex-fill text-dark text-truncate">
            <OverlayTrigger overlay={<Tooltip id={label}>{value}</Tooltip>}>
                <span>{value}</span>
            </OverlayTrigger>
        </div>
    </div>
);

/**
 * 기자 관리 > 기자 정보 조회/수정
 */
const ReporterEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { repSeq: paramSeq } = useParams();
    const reporter = useSelector(({ reporter }) => reporter.reporter);
    const [temp, setTemp] = useState({});

    /**
     * 각 항목별 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, checked } = target;
        setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
    };

    /**
     * 기자관리 내용 저장 이벤트
     */
    const handleClickSave = () => {
        const tmp = {
            ...reporter,
            usedYn: temp.usedYn,
            talkYn: temp.talkYn,
            repTalk: temp.repTalk,
        };

        if (paramSeq) {
            dispatch(
                saveReporter({
                    reporter: tmp,
                    callback: ({ header, body }) => {
                        header.success ? toast.success(header.message) : messageBox.alert(header.message);
                        dispatch(getReporter(body.repSeq));
                    },
                }),
            );
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
        }
    }, [dispatch, paramSeq]);

    useEffect(() => {
        let typeCode = 'R1: 중앙일보 기자';

        if (!commonUtil.isEmpty(reporter.r1CdNm)) {
            typeCode = `R1: ${reporter.r1CdNm}`;
        }

        typeCode += ', R2:';
        if (!commonUtil.isEmpty(reporter.jplusRepDiv)) {
            typeCode += ` ${reporter.jplusRepDiv}`;
        }

        if (!commonUtil.isEmpty(reporter.jplusRepDiv) && !commonUtil.isEmpty(reporter.r2CdNm)) {
            typeCode += ' -';
        }

        if (!commonUtil.isEmpty(reporter.r2CdNm)) {
            typeCode += ` ${reporter.r2CdNm}`;
        }

        setTemp({
            ...reporter,
            usedYn: reporter.usedYn || 'N',
            talkYn: reporter.talkYn || 'N',
            rMail1: reporter.repEmail2 || ''.split('|')[0] || '',
            rMail2: reporter.repEmail2 || ''.split('|')[1] || '',
            rMail3: reporter.repEmail2 || ''.split('|')[2] || '',
            rMail4: reporter.repEmail2 || ''.split('|')[3] || '',
            modDt: reporter.modDt && reporter.modDt.length > 10 ? reporter.modDt.substr(0, 11) : reporter.modDt,
            typeCode,
        });
    }, [reporter]);

    useEffect(() => {
        return () => {
            dispatch(clearReporter());
        };
    }, [dispatch]);

    return (
        <>
            <hr className="mt-0" />

            <div className="d-flex align-items-center">
                {/* 기자 이미지 */}
                {temp.repImg ? (
                    <Image width="100" height="100" src={temp.repImg} className="flex-shrink-0" roundedCircle />
                ) : (
                    <MokaIcon
                        iconName="fal-user"
                        style={{
                            color: '#fff',
                            background: '#CED1DB',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            textAlign: 'center',
                            lineHeight: '10px',
                            verticalAlign: 'middle',
                            padding: '20px',
                        }}
                    />
                )}

                <div className="flex-fill d-flex flex-column ml-4">
                    {/* 기자 정보 */}
                    <div className="d-flex align-items-center justify-content-center mb-14">
                        <div className="d-flex flex-column">
                            {/*<p className="mb-2">
                                <span className="h3 mr-1">{temp.repName}</span>
                                <span className="h3 font-weight-normal">기자</span>
                            </p>*/}
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
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <div>
                            <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                                저장
                            </Button>
                            <Button variant="negative" onClick={handleClickCancle}>
                                취소
                            </Button>
                        </div>
                    </div>
                    <div className="text-right">최종 수정일: {temp.modDt}</div>

                    {/* 최종 수정일 */}
                </div>
            </div>

            <hr />

            <Form>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="이름" value={temp.repName || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="표시 직책" value={temp.repTitle || '-'} />
                    </Col>
                </Form.Row>
                {/*<Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="소속 1" value={temp.r1CdNm || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="소속 2" value={temp.r2CdNm || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="소속 3" value={temp.r3CdNm || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="소속 4" value={temp.r4CdNm || '-'} />
                    </Col>
                </Form.Row>*/}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="타입코드" value={temp.typeCode || '중앙일보 기자'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="집배신 이메일" value={temp.repEmail1 || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="중앙 ID" value={temp.joinsId || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="분야" value={temp.repField || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="페이스북" value={temp.snsFb || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="트위터" value={temp.snsTw || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="인스타그램" value={temp.snsIn || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="블로그" value={temp.joinsBlog || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="JNET ID" value={temp.jnetId || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="JNET 이메일1" value={temp.rMail1 || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="JNET 이메일2" value={temp.rMail2 || '-'} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <ReporterInput label="JNET 이메일3" value={temp.rMail3 || '-'} />
                    </Col>
                    <Col xs={6} className="p-0">
                        <ReporterInput label="JNET 이메일4" value={temp.rMail4 || '-'} />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="기자 한마디" />
                </Form.Row>
                <MokaInput
                    as="textarea"
                    rows={3}
                    className="p-3"
                    value={temp.repTalk}
                    onChange={(e) => {
                        setTemp({ ...temp, repTalk: e.target.value });
                    }}
                />
            </Form>
        </>
    );
};

export default ReporterEdit;
