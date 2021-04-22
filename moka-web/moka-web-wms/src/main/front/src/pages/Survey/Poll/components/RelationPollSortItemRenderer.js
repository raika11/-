import React from 'react';
import { MokaTableEditCancleButton, MokaPrependLinkInput } from '@components';

const replaceNo = (t) => ('00' + t).slice(-2);

const RelationPollSortItemRenderer = ({ item, onDelete }) => {
    const handleClickDelete = () => {
        if (onDelete instanceof Function) {
            onDelete(item.ordNo);
        }
    };

    return (
        <div className="h-100 d-flex align-items-center">
            <div className="flex-shrink-0 d-flex align-items-center mr-12">{replaceNo(item.ordNo)}</div>
            <MokaPrependLinkInput
                linkText={`ID: ${item.contentId}`}
                className="flex-fill"
                inputList={{
                    value: item.title || '',
                    disabled: true,
                    name: 'title',
                    className: 'bg-white',
                }}
            />
            <div className="mr-12 ml-10" style={{ width: 13 }}>
                <MokaTableEditCancleButton onClick={handleClickDelete} />
            </div>
        </div>
    );
};

export default RelationPollSortItemRenderer;
