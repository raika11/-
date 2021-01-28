import React from 'react';
import { useHistory } from 'react-router-dom';

import QuizSearch from '@pages/Survey/Quiz/QuizSearch';
import QuizAgGrid from '@pages/Survey/Quiz/QuizAgGrid';

const QuizList = () => {
    const history = useHistory();
    const handleClickAdd = () => {
        history.push('/quiz/add');
    };
    return (
        <>
            <QuizSearch onAdd={handleClickAdd} />
            <QuizAgGrid />
        </>
    );
};

export default QuizList;
