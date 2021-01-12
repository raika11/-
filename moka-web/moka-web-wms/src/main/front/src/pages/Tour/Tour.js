import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';

const TourList = React.lazy(() => import('./TourList'));
const TourMonth = React.lazy(() => import('./TourMonth'));
const TourMsgSet = React.lazy(() => import('./TourMsgSet'));
const TourSet = React.lazy(() => import('./TourSet'));

const Tour = ({ match, ...rest }) => {
    const history = useHistory();
    if (match.path === '/tour-month') {
        return (
            <Suspense>
                <TourMonth match={match} {...rest} />
            </Suspense>
        );
    } else if (match.path === '/tour-list') {
        return (
            <Suspense>
                <TourList match={match} {...rest} />
            </Suspense>
        );
    } else if (match.path === '/tour-set') {
        return (
            <Suspense>
                <TourSet match={match} {...rest} />
            </Suspense>
        );
    } else if (match.path === '/tour-message') {
        return (
            <Suspense>
                <TourMsgSet match={match} {...rest} />
            </Suspense>
        );
    } else {
        history.push('/404');
    }
};

export default Tour;
