import React, { useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { selectQuestions } from '@store/survey/quiz';
import { useDispatch } from 'react-redux';
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

    useEffect(() => {
        console.log(previewModalState);
    }, [previewModalState]);

    return (
        <>
            <Col className="pt-2" onClick={() => handleClickTitle()}>
                {title}
            </Col>
            <QuestionsPreviewModal privewShow={previewModalState} priviewInfo={questionsPriviewInfo} onPriviewHide={() => hancldClickOnPriviewHide()} />
        </>
    );
};
