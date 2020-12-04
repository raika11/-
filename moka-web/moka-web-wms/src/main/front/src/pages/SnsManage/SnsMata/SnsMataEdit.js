import React, { useState } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Figure } from 'react-bootstrap';
import MataModal from './modal/MataModal';

const SnsMataEdit = () => {
    const [modalShow, setModalShow] = useState(false);

    // 임시 예약 노출 클릭시 dateTimePicker disabled 처리.
    const [rdateDisable, setRdateDisable] = useState({
        facebook: true,
        twitter: true,
    });

    // 임시 예약노출 체크 박스 클릭 처리.
    const handleClickCheckBox = (e) => {
        const { name, checked } = e.target;

        if (name === 'facebookReservation') {
            setRdateDisable({
                ...rdateDisable,
                facebook: checked === true ? false : true,
            });
        } else if (name === 'twitterReservation') {
            setRdateDisable({
                ...rdateDisable,
                twitter: checked === true ? false : true,
            });
        }
    };

    // 임시.
    const tempOnchange = (e) => {};

    // 임시.
    const handleClickFBTokenManage = () => {
        setModalShow(true);
    };

    // 임시.
    const tempHandleSendButton = (e) => {
        console.log('tempHandleSendButton', e);
    };

    const tempFooterButtonClick = (e) => {
        console.log('tempFooterButtonClick', e);
    };

    return (
        <MokaCard
            width={550}
            title={`메타 ${true ? '정보' : '등록'}`}
            titleClassName="mb-0"
            loading={null}
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '전송', variant: 'positive', onClick: tempFooterButtonClick, className: 'mr-05' },
                { text: '임시저장', variant: 'positive', onClick: tempFooterButtonClick, className: 'mr-05' },
                { text: '미리보기', variant: 'outline-neutral', onClick: tempFooterButtonClick, className: 'mr-05' },
            ]}
            footer
        >
            <hr />

            {/* 페이스북 */}
            <Form.Row>
                <Col xs={12} className="pb-4">
                    <div className="d-flex">
                        <MokaInputLabel label="Facebook" labelWidth={70} className="m-0 h5" as="none" />
                        <div className="d-flex justify-content-center">
                            <Button variant="outline-neutral" className="mr-05">
                                FB 전송
                            </Button>
                            <Button variant="outline-neutral" className="mr-05">
                                FB 캐시삭제
                            </Button>
                            <Button variant="outline-neutral" className="mr-05" onClick={(e) => handleClickFBTokenManage(e)}>
                                토큰 관리
                            </Button>
                            <Button variant="outline-neutral" className="mr-05">
                                공유
                            </Button>
                            <Button variant="outline-neutral" className="mr-05">
                                TW로 복사
                            </Button>
                        </div>
                    </div>
                </Col>
            </Form.Row>

            <Form className="mb-gutter">
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel as="switch" name="status" id="status" label="사용유무" variant="positive" labelWidth={87} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel label="타이틀" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel as="textarea" label="설명(리드문)" inputClassName="resize-none" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel as="textarea" label="메시지" inputClassName="resize-none" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                    </Col>
                </Form.Row>

                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="SNS 이미지" labelWidth={87} />
                        <MokaInputLabel as="none" label="(850*350px)" labelWidth={87} />
                    </Col>
                    <Col xs={8} className="pl-2">
                        <Col>
                            <Figure.Image className="mb-0" src={'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/75752c82-c8c4-45f1-8741-bed04a3a19b4.jpg'} />
                        </Col>
                        <Col>
                            <Form.Label className="text-danger">1200*628 이미지 용량 제한: 1MB.</Form.Label>
                        </Col>
                    </Col>
                    <Col xs={2} className="pb-5 align-self-end">
                        <Col xs={2} className="pl-0 pb-1">
                            <Button variant="outline-neutral">편집</Button>
                        </Col>
                        <Col xs={2} className="pl-0">
                            <Button variant="outline-neutral">신규 등록</Button>
                        </Col>
                    </Col>
                </Form.Row>
                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="예약" labelWidth={87} />
                    </Col>
                    <Col xs={4} className="d-flex pl-4 mr-0 pr-1">
                        <Form.Check label="예약 노출" type="checkbox" name="facebookReservation" onChange={(e) => handleClickCheckBox(e)} />
                    </Col>
                    <Col xs={5} className="d-flex pl-0">
                        <MokaInput
                            as="dateTimePicker"
                            name="facebookRDate"
                            value={null}
                            onChange={(e) => tempOnchange(e)}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }}
                            disabled={rdateDisable.facebook}
                        />
                    </Col>
                </Form.Row>
            </Form>

            <hr />

            {/* 트위터 */}
            <Form.Row>
                <Col xs={12} className="pb-4">
                    <div className="d-flex">
                        <MokaInputLabel label="Twitter" labelWidth={70} className="m-0 h5" as="none" />
                        <Col className="d-flex justify-content-end">
                            <div className="justify-content-end pr-2">
                                <Button variant="outline-neutral" className="mr-05">
                                    TW 전송
                                </Button>
                            </div>
                            <div className="justify-content-end pr-2">
                                <Button variant="outline-neutral" className="mr-05">
                                    TW 캐시삭제
                                </Button>
                            </div>
                            <div className="justify-content-end pr-2">
                                <Button variant="outline-neutral" className="mr-05">
                                    FB로 복사
                                </Button>
                            </div>
                        </Col>
                    </div>
                </Col>
            </Form.Row>

            <Form className="mb-gutter">
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel as="switch" name="status" id="status" label="사용유무" variant="positive" labelWidth={87} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel label="타이틀" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel as="textarea" label="설명(리드문)" inputClassName="resize-none" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel as="textarea" label="메시지" inputClassName="resize-none" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                    </Col>
                </Form.Row>

                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="SNS 이미지" labelWidth={87} />
                        <MokaInputLabel as="none" label="(850*350px)" labelWidth={87} />
                    </Col>
                    <Col xs={8} className="pl-2">
                        <Col>
                            <Figure.Image className="mb-0" src={'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/75752c82-c8c4-45f1-8741-bed04a3a19b4.jpg'} />
                        </Col>
                        <Col>
                            <Form.Label className="text-danger">1200*628 이미지 용량 제한: 1MB.</Form.Label>
                        </Col>
                    </Col>
                    <Col xs={2} className="pb-5 align-self-end">
                        <Col xs={2} className="pl-0 pb-1">
                            <Button variant="outline-neutral">편집</Button>
                        </Col>
                        <Col xs={2} className="pl-0">
                            <Button variant="outline-neutral">신규 등록</Button>
                        </Col>
                    </Col>
                </Form.Row>
                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="예약" labelWidth={87} />
                    </Col>
                    <Col xs={4} className="d-flex pl-4 mr-0 pr-1">
                        <Form.Check label="예약 노출" type="checkbox" name="twitterReservation" onChange={(e) => handleClickCheckBox(e)} />
                    </Col>
                    <Col xs={5} className="d-flex pl-0">
                        <MokaInput
                            as="dateTimePicker"
                            name="twitterRDate"
                            value={null}
                            onChange={(e) => tempOnchange(e)}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }}
                            disabled={rdateDisable.twitter}
                        />
                    </Col>
                </Form.Row>
            </Form>

            <MataModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={null} />
        </MokaCard>
    );
};

export default SnsMataEdit;
