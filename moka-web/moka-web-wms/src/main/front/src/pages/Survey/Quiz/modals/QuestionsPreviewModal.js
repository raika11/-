import React, { useEffect, useState } from 'react';
import { MokaModal, MokaInputLabel } from '@components';
import { Form, Col, Figure } from 'react-bootstrap';

/**
 * 미리보기 모달.
 */
const QuestionsPreviewModal = (props) => {
    const { privewShow, onPriviewHide, priviewInfo } = props;

    const [priviewInfoState, setPriviewInfoState] = useState({
        answer: null,
        choiceCnt: '',
        choices: [],
        imgUrl: '',
        questionDesc: '',
        questionSeq: '',
        questionType: '',
        title: '',
    });

    const handleChangeEditData = () => {};

    // 닫기 버튼
    const handleClickHide = () => {
        onPriviewHide();
    };

    // 모달창이 열리면 목록 가져오기.
    useEffect(() => {
        if (privewShow === true) {
            const setPriviewInfo = (data) => {
                setPriviewInfoState(data);
            };

            setPriviewInfo(priviewInfo);
        } else {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [privewShow]);

    return (
        <MokaModal
            width={900}
            show={privewShow}
            onHide={handleClickHide}
            title={`문항 미리보기`}
            size="md"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            // buttons={[{ text: '닫기', variant: 'negative', onClick: handleClickHide }]}
            draggable
        >
            {(function () {
                if (priviewInfoState.questionType === 'S') {
                    return (
                        <>
                            <div className="mb-2 p-2">
                                <Form.Row>
                                    <Col xs={10}>Q1. {priviewInfoState.title}</Col>
                                </Form.Row>
                                <hr />
                                <Form.Row className="pt-3">
                                    <Col xs={9}>
                                        {priviewInfoState.choices.map((element, index) => {
                                            return (
                                                <Form.Row className="pt-1" key={index}>
                                                    <Col xs={10}>{` 보기 ${index + 1} ${element.title}`}</Col>
                                                </Form.Row>
                                            );
                                        })}
                                    </Col>

                                    <Col xs={3}>
                                        <Figure.Image className="center-image" src={priviewInfoState.imgUrl} />
                                    </Col>
                                </Form.Row>
                                <Form.Row className="pt-2">
                                    <Col xs={12}>
                                        <MokaInputLabel
                                            readOnly
                                            as="textarea"
                                            className="mb-2 resize-none bg-white p-3"
                                            inputClassName="resize-none"
                                            inputProps={{ rows: 2 }}
                                            id="questionDesc"
                                            name="questionDesc"
                                            value={priviewInfoState.questionDesc}
                                            placeholder="정답 설명을 입력(90자 이내로 입력하세요)"
                                            onChange={(e) => handleChangeEditData(e)}
                                        />
                                    </Col>
                                </Form.Row>
                            </div>
                        </>
                    );
                } else if (priviewInfoState.questionType === 'O') {
                    return (
                        <>
                            <div className="mb-2 p-2">
                                <Form.Row>
                                    <Col xs={10}>Q1. {priviewInfoState.title}</Col>
                                </Form.Row>
                                <Form.Row className="pt-3">
                                    <Col xs={9}>
                                        <Form.Row className="pt-1">
                                            <Col xs={12}>{`${priviewInfoState.answer}`}</Col>
                                        </Form.Row>
                                        <Form.Row className="pt-2">
                                            <Col xs={12}>
                                                <MokaInputLabel
                                                    as="textarea"
                                                    className="mb-2"
                                                    inputClassName="resize-none"
                                                    inputProps={{ rows: 2 }}
                                                    name="questionDesc"
                                                    value={priviewInfoState.questionDesc}
                                                    placeholder="정답 설명을 입력(90자 이내로 입력하세요)"
                                                    onChange={(e) => handleChangeEditData(e)}
                                                />
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                    <Col xs={3}>
                                        <Figure.Image className="center-image" src={priviewInfoState.imgUrl} />
                                    </Col>
                                </Form.Row>
                            </div>
                        </>
                    );
                }
            })()}
        </MokaModal>
    );
};

export default QuestionsPreviewModal;
