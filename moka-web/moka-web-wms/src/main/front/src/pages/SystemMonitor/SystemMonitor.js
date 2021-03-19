import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaErrorBoundary } from '@components';
const CdnArticle = React.lazy(() => import('./CdnArticle'));
const Schedule = React.lazy(() => import('./Schedule'));

/**
 * 시스템 모니터링
 */
const SystemMonitor = ({ name, ...rest }) => {
    const history = useHistory();

    if (name === 'cdnArticle') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <CdnArticle name={name} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else if (name === 'schedule') {
        return (
            <MokaErrorBoundary>
                <Suspense>
                    <Schedule name={name} {...rest} />
                </Suspense>
            </MokaErrorBoundary>
        );
    } else {
        history.push('/404');
    }
};

export default SystemMonitor;
