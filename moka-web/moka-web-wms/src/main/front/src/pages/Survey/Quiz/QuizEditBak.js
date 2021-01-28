import React, { useEffect, useState, useRef } from 'react';
import Sortable from '@pages/Survey/component/sortable';
import { Form, Col, Button, Figure } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { BLANK_IMAGE_PATH, IR_URL } from '@/constants';
import QuizMultipleChoiceComponent from '@pages/Survey/Quiz/components/QuizMultipleChoiceComponent';

import { initialState, GET_QUIZZES, clearQuizinfo, getQuizzes } from '@store/survey/quiz';

const QuizEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const selectQuizSeq = useRef(null);
    const [editData, setEditData] = useState(initialState.quizInfo);

    // 공통 구분값 URL
    const { quizInfo, loading } = useSelector((store) => ({
        quizInfo: store.quiz.quizInfo,
        loading: store.loading[GET_QUIZZES],
    }));

    const tempEvent = () => {};

    const handleChangeEditData = ({ target }) => {
        const { name, value, checked } = target;

        console.log(name, value, checked);
    };

    const handleResetInfoData = () => {
        setEditData(initialState.quizInfo);
    };

    // url 에서 현재 선택한 게시판 id 값 설정.
    useEffect(() => {
        const { quizSeq } = params;
        if (!isNaN(quizSeq) && selectQuizSeq.current !== quizSeq) {
            selectQuizSeq.current = quizSeq;
            dispatch(getQuizzes({ quizSeq: quizSeq }));
        } else if (history.location.pathname === '/quiz/add') {
            handleResetInfoData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        return () => {
            dispatch(clearQuizinfo());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 스토어에서 quizInfo 가 업데이트 되었을때. ( 목록에서 클릭 했을고 url 이 변경 되었을때.)
    useEffect(() => {
        if (loading === false) {
            setEditData(quizInfo);
        }
    }, [loading, quizInfo]);

    return (
        <MokaCard
            titleAs={
                <div className="w-100 d-flex">
                    <p className="m-0 h5 font-weight-bold">투표 등록</p>
                    <p className="m-0 pl-2 ft-12 text-positive">* 필수 입력항목</p>
                </div>
            }
            className="flex-fill"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => console.log('저장'), className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: () => history.push('/quiz'), className: 'mr-05' },
            ]}
            width={750}
        >
            <Form>
                <Form.Row className="mb-2 p-2">
                    <Col xs={9}>
                        <Form.Row className="mb-2">
                            <Col xs={6}>
                                <MokaInputLabel label="서비스 상태" as="select" labelWidth={66} onChange={(e) => handleChangeEditData(e)}>
                                    <option value="stop">일시중지</option>
                                    <option value="start">서비스중</option>
                                    <option value="start">서비스 종료</option>
                                </MokaInputLabel>
                            </Col>
                            <Col xs={3} className="pr-0">
                                <MokaInputLabel
                                    as="switch"
                                    label="로그인"
                                    labelClassName="text-right ml-0"
                                    id="loginYn"
                                    name="loginYn"
                                    inputProps={{ checked: editData.loginYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeEditData(e)}
                                    value={editData.loginYn}
                                />
                            </Col>
                            <Col xs={3} className="pl-0 pr-0">
                                <MokaInputLabel as="switch" label="댓글" labelClassName="text-right" />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel label="그룹 제목" labelWidth={66} required={true} value={editData.title} onChange={(e) => handleChangeEditData(e)} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel label="그룹 설명" labelWidth={66} required={true} onChange={(e) => handleChangeEditData(e)} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel label="url" labelWidth={66} required={true} onChange={(e) => handleChangeEditData(e)} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel as="select" label="결과 유형" labelWidth={66} required={true} onChange={(e) => handleChangeEditData(e)}>
                                    <option value="AA">전체노출전체정답</option>
                                    <option value="AS">전체노출퀴즈별정답</option>
                                    <option value="SA">1건노출전체정답</option>
                                    <option value="SS">1건노출퀴즈별정답</option>
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                    </Col>
                    <Col xs={3}>
                        <Form.Row>
                            <Col xs={12} className="d-flex align-items-center">
                                <Form.Label className="px-0 mb-0 position-relative flex-shrink-0">퀴즈 커버 이미지</Form.Label>
                            </Col>
                        </Form.Row>
                        <Form.Row style={{ height: '55%' }} className="mb-2">
                            <Col xs={12}>
                                <Figure.Image src={IR_URL + BLANK_IMAGE_PATH} className="mb-0 w-100 h-100" />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={12} className="d-flex justify-content-center">
                                <Button>이미지 등록</Button>
                            </Col>
                        </Form.Row>
                    </Col>
                </Form.Row>

                <Sortable
                    items={[
                        {
                            id: 1,
                            item: (
                                <div className="mb-2 p-2 bg-gray150">
                                    <Form.Row className="w-100 justify-content-between mb-2">
                                        <Col xs={7}>
                                            <Form.Row>
                                                <Col xs={6}>
                                                    <MokaInputLabel as="select" labelWidth={66} label="퀴즈 유형" required onChange={(e) => handleChangeEditData(e)}>
                                                        <option value="1">객관식</option>
                                                        <option value="2">주관식</option>
                                                    </MokaInputLabel>
                                                </Col>
                                                <Col xs={6}>
                                                    <MokaInputLabel
                                                        type="number"
                                                        label="보기 입력 개수"
                                                        labelWidth={85}
                                                        required
                                                        value={100}
                                                        onChange={(e) => handleChangeEditData(e)}
                                                    />
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Row>
                                                <Col xs={4}>
                                                    <Button variant="positive">생성</Button>
                                                </Col>
                                                <Col xs={8} className="ml-2">
                                                    <Button variant="searching">퀴즈 검색</Button>
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                    </Form.Row>
                                    <QuizMultipleChoiceComponent questionNumber={1} answerCount={3} />
                                </div>
                            ),
                        },
                        {
                            id: 2,
                            item: (
                                <div className="mb-2 p-2 bg-gray150">
                                    <Form.Row className="w-100 justify-content-between mb-2">
                                        <Col xs={7}>
                                            <Form.Row>
                                                <Col xs={6}>
                                                    <MokaInputLabel as="select" labelWidth={66} label="퀴즈 유형" required onChange={(e) => handleChangeEditData(e)}>
                                                        <option value="1">객관식</option>
                                                        <option value="2">주관식</option>
                                                    </MokaInputLabel>
                                                </Col>
                                                <Col xs={6}>
                                                    <MokaInputLabel
                                                        type="number"
                                                        label="보기 입력 개수"
                                                        labelWidth={85}
                                                        required
                                                        value={100}
                                                        onChange={(e) => handleChangeEditData(e)}
                                                    />
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Row>
                                                <Col xs={4}>
                                                    <Button variant="positive">생성</Button>
                                                </Col>
                                                <Col xs={8} className="ml-2">
                                                    <Button variant="searching">퀴즈 검색</Button>
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                    </Form.Row>
                                    <QuizMultipleChoiceComponent questionNumber={2} answerCount={5} />
                                </div>
                            ),
                        },
                        {
                            id: 3,
                            item: (
                                <div className="mb-2 p-2 bg-gray150">
                                    <Form.Row className="w-100 justify-content-between mb-2">
                                        <Col xs={7}>
                                            <Form.Row>
                                                <Col xs={6}>
                                                    <MokaInputLabel as="select" labelWidth={66} label="퀴즈 유형" required onChange={(e) => handleChangeEditData(e)}>
                                                        <option value="1">객관식</option>
                                                        <option value="2">주관식</option>
                                                    </MokaInputLabel>
                                                </Col>
                                                <Col xs={6}>
                                                    <MokaInputLabel
                                                        type="number"
                                                        label="보기 입력 개수"
                                                        labelWidth={85}
                                                        required
                                                        value={100}
                                                        onChange={(e) => handleChangeEditData(e)}
                                                    />
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Row>
                                                <Col xs={4}>
                                                    <Button variant="positive">생성</Button>
                                                </Col>
                                                <Col xs={8} className="ml-2">
                                                    <Button variant="searching">퀴즈 검색</Button>
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                    </Form.Row>
                                    <QuizMultipleChoiceComponent questionNumber={3} answerCount={4} />
                                </div>
                            ),
                        },
                        {
                            id: 4,
                            item: (
                                <div className="mb-2 p-2 bg-gray150">
                                    <Form.Row className="w-100 justify-content-between mb-2">
                                        <Col xs={7}>
                                            <Form.Row>
                                                <Col xs={6}>
                                                    <MokaInputLabel as="select" labelWidth={66} label="퀴즈 유형" required onChange={(e) => handleChangeEditData(e)}>
                                                        <option value="1">객관식</option>
                                                        <option value="2">주관식</option>
                                                    </MokaInputLabel>
                                                </Col>
                                                <Col xs={6}>
                                                    <MokaInputLabel
                                                        type="number"
                                                        label="보기 입력 개수"
                                                        labelWidth={85}
                                                        required
                                                        value={100}
                                                        onChange={(e) => handleChangeEditData(e)}
                                                    />
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Row>
                                                <Col xs={4}>
                                                    <Button variant="positive">생성</Button>
                                                </Col>
                                                <Col xs={8} className="ml-2">
                                                    <Button variant="searching">퀴즈 검색</Button>
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                    </Form.Row>
                                    <QuizMultipleChoiceComponent questionNumber={4} answerCount={4} />
                                </div>
                            ),
                        },
                    ]}
                />
            </Form>
        </MokaCard>
    );
};

export default QuizEdit;
