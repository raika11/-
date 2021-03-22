import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaErrorBoundary } from '@components';
const TourMonth = React.lazy(() => import('./TourMonth'));
const TourList = React.lazy(() => import('./TourList'));
const TourMsgSet = React.lazy(() => import('./TourMsgSet'));
const TourSet = React.lazy(() => import('./TourSet'));

/**
 * 견학
 */
const Tour = ({ match, ...rest }) => {
    const history = useHistory();
    if (match.path === '/tour-month') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <TourMonth match={match} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else if (match.path === '/tour-list') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <TourList match={match} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else if (match.path === '/tour-set') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <TourSet match={match} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else if (match.path === '/tour-message') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <TourMsgSet match={match} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else {
        history.push(`${match.path}/404`);
    }
};

export default Tour;
