import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';

const JaJopan = React.lazy(() => import('./JaJopan'));
const SundayJopan = React.lazy(() => import('./SundayJopan'));

const Jopan = ({ match, ...rest }) => {
    const history = useHistory();
    if (match.path === '/ja-jopan') {
        return (
            <Suspense>
                <JaJopan match={match} {...rest} />
            </Suspense>
        );
    } else if (match.path === '/sunday-jopan') {
        return (
            <Suspense>
                <SundayJopan match={match} {...rest} />
            </Suspense>
        );
    } else {
        history.push('/404');
    }
};

export default Jopan;
