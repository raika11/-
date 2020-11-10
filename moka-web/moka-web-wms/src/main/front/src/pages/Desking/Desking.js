import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * 화면편집
 */
const Desking = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>화면편집</title>
                <meta name="description" content="화면편집페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            화면편집
        </div>
    );
};

export default Desking;
