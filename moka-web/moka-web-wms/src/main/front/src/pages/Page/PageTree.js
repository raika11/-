import React from 'react';

import { MokaTreeView } from '@components';
import data from './tree_data';

const PageTree = () => {
    return <MokaTreeView height={500} data={data.body} onInsert={() => {}} onDelete={() => {}} />;
};

export default PageTree;
