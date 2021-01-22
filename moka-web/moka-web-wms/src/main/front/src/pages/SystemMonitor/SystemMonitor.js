import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';

const CdnArticle = React.lazy(() => import('./CdnArticle'));
const Schedule = React.lazy(() => import('./Schedule'));

const SystemMonitor = ({ name, ...rest }) => {
    const history = useHistory();

    if (name === 'cdnArticle') {
        return (
            <Suspense>
                <CdnArticle name={name} {...rest} />
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
