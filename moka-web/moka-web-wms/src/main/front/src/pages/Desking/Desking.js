import React from 'react';
import { Helmet } from 'react-helmet';

const DeskingTab = React.lazy(() => import('./DeskingTab'));

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

            <DeskingTab />
        </div>
    );
};

export default Desking;
