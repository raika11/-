import React, { useRef, useState } from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';

const PollDetailBasicPhotoAnswerComponent = ({ item, index, hasUrl }) => {
    return (
        <div className="d-inline-flex flex-column">
            <PollPhotoComponent key={index} width="100px" height="100px" src={item.imgUrl}>
                150x150
            </PollPhotoComponent>
            <div className="text-center">{`보기 ${index + 1}`}</div>
        </div>
    );
};

export default PollDetailBasicPhotoAnswerComponent;
