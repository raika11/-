import React from 'react';

import { MokaCard } from '@components';
import TemplateSearch from './PageChildTemplateSearch';
import TemplateAggrid from './PageChildTemplateAggrid';

const PageChildTemplateList = () => {
    return (
        <MokaCard className="mr-10" headerClassName="pb-0" titleClassName="mb-0" title="템플릿 검색">
            <TemplateSearch />
            <TemplateAggrid />
        </MokaCard>
    );
};

export default PageChildTemplateList;
