import React, { useState } from 'react';

import { MokaTreeView } from '@components';
import data from './tree_data';

const PageTree = () => {
    const [selected, setSelected] = useState('');

    return (
        <MokaTreeView
            height={500}
            data={data.body}
            expanded={['3', '41']}
            selected={selected}
            onSelected={(data) => {
                setSelected(String(data.pageSeq));
                console.log(data.pageSeq);
            }}
            labelHoverButtons={[
                { text: '+', onClick: (data) => console.log(data), variant: 'warning' },
                { text: '-', onClick: (data) => console.log(data), variant: 'warning' },
            ]}
        />
    );
};

export default PageTree;
