import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { messageBox } from '@utils/toastUtil';
import { selectQuestions, selectQuizChange } from '@store/survey/quiz';
import QuestionsPreviewModal from './QuestionsPreviewModal';

export const QuestionsInfoAddButtonRenderer = ({ questionsInfo }) => {
    const dispatch = useDispatch();

    const handleClickButton = () => {
        dispatch(selectQuestions({ questionSeq: questionsInfo.questionSeq }));
    };

    return (
        <>
            {/* <Col className="pt-2">
                <Button variant="negative" onClick={() => handleClickButton()}>
                    등록
                </Button>
            </Col> */}
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Button variant="outline-table-btn" onClick={() => handleClickButton()} size="sm">
                    등록
                </Button>
            </div>
        </>
    );
};

export const QuestionsPreviewRenderer = ({ questionsPriviewInfo }) => {
    const title = questionsPriviewInfo.question.title;

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

/**
 * 퀴즈 모달 > 등록 버튼
 */
export const QuizSearchAddButtonRenderer = ({ quizInfo }) => {
    const dispatch = useDispatch();
    const selectQuiz = useSelector(({ quiz }) => quiz.selectQuiz);

    /**
     * 등록
     */
    const handleClickButton = () => {
        if (selectQuiz.findIndex((q) => String(q.contentId) === String(quizInfo.quizSeq)) < 0) {
            dispatch(
                selectQuizChange([
                    ...selectQuiz,
                    {
                        ...quizInfo,
                        contentId: quizInfo.quizSeq,
                    },
                ]),
            );
        } else {
            messageBox.alert('등록된 퀴즈입니다');
        }
    };

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Button variant="outline-table-btn" onClick={() => handleClickButton()} size="sm">
                등록
            </Button>
        </div>
    );
};
