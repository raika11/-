import React, { useEffect, useState } from 'react';
import commonUtil from '@utils/commonUtil';
import PollDetailCompareTextAnswerComponent from '@pages/Survey/Poll/components/PollDetailCompareTextAnswerComponent';
import PollDetailComparePhotoAnswerComponent from '@pages/Survey/Poll/components/PollDetailComparePhotoAnswerComponent';
import PollDetailCompareCombineAnswerComponent from '@pages/Survey/Poll/components/PollDetailCompareCombineAnswerComponent';
import produce from 'immer';

const PollDetailCompareAnswerContainer = ({ items, type, onChange }) => {
    const [editItems, setEditItems] = useState([
        { title: '', linkUrl: '', imgUrl: null, imgFile: null },
        { title: '', linkUrl: '', imgUrl: null, imgFile: null },
    ]);

    const handleChangeItems = (index, name, value, type) => {
        const changeItems = produce(editItems, (draft) => {
            if (type === 'file') {
                draft[index]['imgUrl'] = null;
            }
            draft[index][name] = value;
        });

        setEditItems(changeItems);
        if (onChange instanceof Function) {
            onChange(changeItems);
        }
    };

    useEffect(() => {
        setEditItems(items);
    }, [items]);

    let AnswerComponent = null;
    switch (type) {
        case 'T':
            AnswerComponent = PollDetailCompareTextAnswerComponent;
            break;
        case 'P':
            AnswerComponent = PollDetailComparePhotoAnswerComponent;
            break;
        case 'M':
            AnswerComponent = PollDetailCompareCombineAnswerComponent;
            break;
        default:
            break;
    }

    return <>{!commonUtil.isEmpty(AnswerComponent) && <AnswerComponent items={editItems} hasUrl={false} onChange={handleChangeItems} />}</>;
};

export default PollDetailCompareAnswerContainer;
