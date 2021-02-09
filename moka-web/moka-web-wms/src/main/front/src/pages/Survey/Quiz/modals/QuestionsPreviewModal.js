import React, { useEffect, useState } from 'react';
import { MokaModal, MokaInputLabel } from '@components';
import { Form, Col, Figure } from 'react-bootstrap';
import { selectQuestions } from '@store/survey/quiz';
import toast, { messageBox } from '@utils/toastUtil';
import { useDispatch } from 'react-redux';
/**
 * 미리보기 모달.
 */
const QuestionsPreviewModal = (props) => {
    const dispatch = useDispatch();
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
                dispatch(
                    selectQuestions({
                        questionSeq: data.questionSeq,
                        callback: ({ header: { success, message }, body }) => {
                            if (success === true) {
                                setPriviewInfoState(body);
                            } else {
                                const { totalCnt, list } = body;
                                if (totalCnt > 0 && Array.isArray(list)) {
                                    // 에러 메시지 확인.
                                    messageBox.alert(list[0].reason, () => {});
                                } else {
                                    // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                                    messageBox.alert(message, () => {});
                                }
                            }
                        },
                    }),
                );
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
                            <div className="mb-0 p-2">
                                <Form.Row>
                                    <Col xs={10} className="d-flex mb-0 pb-0">
                                        Q1. {priviewInfoState.title}
                                    </Col>
                                </Form.Row>
                                <hr style={{ position: 'relative', height: '1px', margin: '0px 0 0 0' }} />
                                <Form.Row className="pt-3">
                                    <Col xs={9}>
                                        {priviewInfoState.choices.map((element, index) => {
                                            return (
                                                <div key={index}>
                                                    <Form.Row className="pt-0">
                                                        <Col xs={10}>{` 보기 ${index + 1}  ${element.title}`}</Col>
                                                    </Form.Row>
                                                    <hr style={{ position: 'relative', height: '1px', margin: '0px 0 0 0' }} />
                                                </div>
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
                            <div className="mb-2 p-2 flex-fill">
                                <Form.Row className="d-flex bt-0 pt-0">
                                    <Col xs={12}>Q1. {priviewInfoState.title}</Col>
                                </Form.Row>
                                <hr style={{ position: 'relative', height: '1px', margin: '0px 0 0 0' }} />
                                <Form.Row className="pt-3">
                                    <Col xs={12}>
                                        <Form.Row className="pt-1">
                                            <Col xs={12}>{`${priviewInfoState.answer}`}</Col>
                                        </Form.Row>
                                        <hr style={{ position: 'relative', height: '1px', margin: '0px 0 0 0' }} />
                                        <Form.Row className="pt-2">
                                            <Col xs={12}>
                                                <MokaInputLabel
                                                    as="textarea"
                                                    className="mb-2 w-100"
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
