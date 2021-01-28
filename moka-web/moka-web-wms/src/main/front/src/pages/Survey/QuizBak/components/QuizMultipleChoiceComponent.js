import React from 'react';
import QuizQuestionComponent from '@pages/Survey/Quiz/components/QuizQuestionComponent';
import commonUtil from '@utils/commonUtil';
import QuizMultipleChoiceAnswerComponent from '@pages/Survey/Quiz/components/QuizMultipleChoiceAnswerComponent';

const QuizMultipleChoiceComponent = ({ questionNumber, answerCount }) => {
    return (
        <div>
            {!commonUtil.isEmpty(answerCount) && answerCount > 0 && (
                <>
                    <QuizQuestionComponent questionNumber={questionNumber} />
                    {[...Array(answerCount)].map((data, index) => (
                        <QuizMultipleChoiceAnswerComponent key={index + 1} questionNumber={questionNumber} answerNumber={index + 1} />
                    ))}
                </>
            )}
        </div>
    );
};

export default QuizMultipleChoiceComponent;
