import React, { useEffect, useState } from 'react';
import commonUtil from '@utils/commonUtil';
import PollDetailBasicTextAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicTextAnswerComponent';
import PollDetailBasicPhotoAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicPhotoAnswerComponent';
import PollDetailBasicCombineAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicCombineAnswerComponent';
import produce from 'immer';

const PollDetailBasicAnswerContainer = ({ items, type, onChange, hasUrl }) => {
    const [editItems, setEditItems] = useState([]);

    let AnswerComponent = null;
    switch (type) {
        case 'T':
            AnswerComponent = PollDetailBasicTextAnswerComponent;
            break;
        case 'P':
            AnswerComponent = PollDetailBasicPhotoAnswerComponent;
            break;
        case 'M':
            AnswerComponent = PollDetailBasicCombineAnswerComponent;
            break;
        default:
            break;
    }

    const handleChangeValue = (index, item) => {
        if (onChange instanceof Function) {
            onChange(
                produce(editItems, (draft) => {
                    draft[index] = item;
                }),
            );
        }
    };

    useEffect(() => {
        setEditItems(items);
    }, [items]);

    return (
        <>
            {!commonUtil.isEmpty(AnswerComponent) &&
                editItems.map((editItem, index) => (
                    <AnswerComponent
                        key={index}
                        item={editItem}
                        index={index}
                        hasUrl={hasUrl}
                        onChange={(item) => {
                            handleChangeValue(index, item);
                        }}
                    />
                ))}
        </>
    );
};

export default PollDetailBasicAnswerContainer;
