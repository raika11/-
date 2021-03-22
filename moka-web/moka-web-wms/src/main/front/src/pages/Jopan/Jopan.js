import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaErrorBoundary } from '@components';
const JaJopan = React.lazy(() => import('./JaJopan'));
const SundayJopan = React.lazy(() => import('./SundayJopan'));

const Jopan = ({ match, ...rest }) => {
    const history = useHistory();
    if (match.path === '/ja-jopan') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <JaJopan match={match} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else if (match.path === '/sunday-jopan') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <SundayJopan match={match} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else {
        history.push('/404');
    }
};

export default Jopan;
