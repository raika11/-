import React from 'react';
import { Helmet } from 'react-helmet';

const Quiz = () => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>퀴즈 관리</title>
                <meta name="description" content="퀴즈 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
        </div>
    );
};

export default Quiz;
