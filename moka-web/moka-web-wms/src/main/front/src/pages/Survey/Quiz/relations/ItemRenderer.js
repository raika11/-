import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import { MokaTableEditCancleButton } from '@components';
import { selectQuizChange } from '@store/survey/quiz';
import { useSelector, useDispatch } from 'react-redux';

const ItemRenderer = ({ item }) => {
    const dispatch = useDispatch();
    const { selectQuiz } = useSelector((store) => ({
        selectQuiz: store.quiz.selectQuiz,
        selectArticle: store.quiz.selectArticle,
        quizInfo: store.quiz.quizInfo,
        questionsList: store.quiz.quizQuestions.questionsList,
    }));

    // 정보 변경 처리. ( 기능 없음. )
    const handleChangeinputBox = () => {};

    // 삭제 버튼 처리.
    const handleClickDelete = () => {
        const ordNo = item.ordNo;
        dispatch(selectQuizChange(selectQuiz.filter((e) => e.ordNo !== ordNo)));
    };

    return (
        <>
            <Row>
                <Col className="align-self-center justify-content-start mb-0 pr-0 pl-3 w-100">{Number(item.ordNo) + 1}</Col>
                <Col className="d-felx" xs={10}>
                    <Row className="d-felx">
                        <MokaInputLabel
                            name="title"
                            id={`title-${item.ordNo}`}
                            onChange={(e) => handleChangeinputBox(e)}
                            labelWidth={30}
                            value={item.title}
                            className="col mb-0 pl-0 pr-0 pt-1"
                        />
                    </Row>
                </Col>
                <Col className="d-felx align-self-center text-left mb-0 pl-0">
                    <MokaTableEditCancleButton onClick={handleClickDelete} />
                </Col>
            </Row>
        </>
    );
};

export default ItemRenderer;
