import React, { useState } from 'react';
import produce from 'immer';
import AgGridHeader from '../components/AgGridHeader';

const ArticleListPVHeader = ({ ...params }) => {
    const [headers, setHeaders] = useState([
        {
            name: 'PC-PV(uv)',
            sortable: true,
            onSortChange: (sort, event, index) => {
                setHeaders(
                    produce(headers, (draft) => {
                        draft[index].sort = sort;
                    })
                );
            }
        },
        {
            name: 'M-PV(uv)',
            sortable: true,
            onSortChange: (sort, event, index) => {
                setHeaders(
                    produce(headers, (draft) => {
                        draft[index].sort = sort;
                    })
                );
            }
        }
    ]);

    return <AgGridHeader headers={headers} {...params} />;
};

export default ArticleListPVHeader;
