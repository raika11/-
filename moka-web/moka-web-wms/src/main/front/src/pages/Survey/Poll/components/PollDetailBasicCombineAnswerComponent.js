import React from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import { MokaInput } from '@components';

const PollDetailBasicCombineAnswerComponent = ({ item, index, hasUrl }) => {
    return (
        <div className="d-flex align-items-center" key={index}>
            <PollPhotoComponent width={110} height={110} src={item.imgUrl} />
            <div className="d-inline-flex flex-fill h-100 flex-column">
                <div className="m-2">
                    <MokaInput placeholder={`보기 ${index + 1} (20자 이내로 입력하세요)`} value={item.title} />
                </div>
                {(hasUrl || item.linkUrl) && (
                    <div className="m-2">
                        <MokaInput placeholder="url" value={item.linkUrl} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollDetailBasicCombineAnswerComponent;
