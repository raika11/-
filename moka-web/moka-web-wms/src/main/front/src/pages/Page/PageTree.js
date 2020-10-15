import React, { useState } from 'react';
import { toastr } from 'react-redux-toastr';

import { MokaTreeView } from '@components';
import data from './tree_data';

const PageTree = () => {
    const [selected, setSelected] = useState('');

    return (
        <MokaTreeView
            height={638}
            data={data.body}
            expanded={['3', '41']}
            selected={selected}
            onSelected={(data) => {
                setSelected(String(data.pageSeq));
                console.log(data.pageSeq);
            }}
            labelHoverButtons={[
                {
                    text: '+',
                    onClick: (data) => {
                        toastr.warning('+ 아이콘 클릭', data.pageName);
                    },
                    variant: 'warning',
                },
                {
                    text: '-',
                    onClick: (data) => {
                        toastr.success('- 아이콘 클릭', data.pageName);
                    },
                    variant: 'warning',
                },
            ]}
        />
    );
};

export default PageTree;
