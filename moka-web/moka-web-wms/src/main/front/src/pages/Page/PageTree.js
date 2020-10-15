import React, { useState } from 'react';
import produce from 'immer';
import { toastr } from 'react-redux-toastr';

import { MokaTreeView, MokaIcon } from '@components';
import data from './tree_data';

const PageTree = () => {
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState(['3', '41']);

    return (
        <MokaTreeView
            height={638}
            data={data.body}
            expanded={expanded}
            onExpansion={(data) => {
                setExpanded(
                    produce(expanded, (draft) => {
                        if (expanded.indexOf(String(data.pageSeq)) > -1) {
                            const idx = expanded.indexOf(String(data.pageSeq));
                            draft.splice(idx, 1);
                        } else {
                            draft.push(String(data.pageSeq));
                        }
                    }),
                );
            }}
            selected={selected}
            onSelected={(data) => {
                setSelected(String(data.pageSeq));
            }}
            labelHoverButtons={[
                {
                    icon: <MokaIcon iconName="fal-plus" />,
                    onClick: (data) => {
                        toastr.warning('+ 아이콘 클릭', data.pageName);
                    },
                    variant: 'warning',
                },
                {
                    icon: <MokaIcon iconName="fal-minus" />,
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
