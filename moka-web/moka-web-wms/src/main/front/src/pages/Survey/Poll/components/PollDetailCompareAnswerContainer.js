import React, { useEffect, useState } from 'react';
import commonUtil from '@utils/commonUtil';
import PollDetailCompareTextAnswerComponent from '@pages/Survey/Poll/components/PollDetailCompareTextAnswerComponent';
import PollDetailComparePhotoAnswerComponent from '@pages/Survey/Poll/components/PollDetailComparePhotoAnswerComponent';
import PollDetailCompareCombineAnswerComponent from '@pages/Survey/Poll/components/PollDetailCompareCombineAnswerComponent';

const PollDetailCompareAnswerContainer = ({ items, type }) => {
    const [editItems, setEditItems] = useState([
        { title: '', linkUrl: '', imgUrl: '' },
        { title: '', linkUrl: '', imgUrl: '' },
    ]);

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

    useEffect(() => {
        if (items.length === 2) {
            setEditItems(items);
        }
    }, [items]);

    return <>{!commonUtil.isEmpty(AnswerComponent) && <AnswerComponent items={editItems} hasUrl={false} />}</>;
};

export default PollDetailCompareAnswerContainer;
