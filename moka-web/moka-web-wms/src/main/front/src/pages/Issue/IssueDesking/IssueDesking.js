import React, { useState } from 'react';
import { MokaCard } from '@components';
import CollapseArticle from './CollapseArticle';
import CollapseArticleAuto from './CollapseArticleAuto';

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const [artInstance, setArtInstance] = useState(null);

    React.useEffect(() => {
        if (artInstance) artInstance.api.setRowData([]);
    }, [artInstance]);

    return (
        <MokaCard header={false} className="w-100 d-flex flex-column" bodyClassName="scrollable">
            <CollapseArticle gridInstance={artInstance} setGridInstance={setArtInstance} />
            <CollapseArticleAuto />
        </MokaCard>
    );
};

export default IssueDesking;
