import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { selectQuestions, selectQuizChange } from '@store/survey/quiz';
import { useDispatch, useSelector } from 'react-redux';
import QuestionsPreviewModal from './QuestionsPreviewModal';

export const QuestionsInfoAddButtonRenderer = ({ questionsInfo }) => {
    const dispatch = useDispatch();

    const handleClickButton = () => {
        dispatch(selectQuestions(questionsInfo));
    };

    return (
        <>
            <Col className="pt-2">
                <Button variant="negative" onClick={() => handleClickButton()}>
                    등록
                </Button>
            </Col>
        </>
    );
};

export const QuestionsPreviewRenderer = ({ questionsPriviewInfo }) => {
    const title = questionsPriviewInfo.title;

    const [previewModalState, setPreviewModalState] = useState(false);

    const handleClickTitle = () => {
        setPreviewModalState(true);
    };
    const hancldClickOnPriviewHide = () => {
        setPreviewModalState(false);
    };

    return (
        <>
            <Col className="pt-2" onClick={() => handleClickTitle()}>
                {title}
            </Col>
            <QuestionsPreviewModal privewShow={previewModalState} priviewInfo={questionsPriviewInfo} onPriviewHide={() => hancldClickOnPriviewHide()} />
        </>
    );
};

export const QuizSearchAddButtonRenderer = ({ quizInfo }) => {
    const dispatch = useDispatch();
    const { selectQuiz } = useSelector((store) => ({
        selectQuiz: store.quiz.selectQuiz,
    }));

    const handleClickButton = () => {
        dispatch(
            selectQuizChange([
                ...selectQuiz,
                {
                    contentId: quizInfo.quizSeq,
                    title: quizInfo.title,
                },
            ]),
        );
    };

    return (
        <>
            <Col>
                <Button variant="negative" onClick={() => handleClickButton()}>
                    등록
                </Button>
            </Col>
        </>
    );
};