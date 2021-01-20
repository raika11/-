import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';

const ArticleCdn = React.lazy(() => import('./ArticleCdn'));
const Schedule = React.lazy(() => import('./Schedule'));

const SystemMonitor = ({ name, ...rest }) => {
    const history = useHistory();

    if (name === 'articleCdn') {
        return (
            <Suspense>
                <ArticleCdn name={name} {...rest} />
            </Suspense>
        );
    } else if (name === 'schedule') {
        return (
            <Suspense>
                <Schedule name={name} {...rest} />
            </Suspense>
        );
    } else {
        history.push('/404');
    }
};

export default SystemMonitor;
