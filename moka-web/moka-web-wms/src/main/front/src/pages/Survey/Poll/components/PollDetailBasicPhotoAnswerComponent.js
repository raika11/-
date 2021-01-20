import React, { useRef, useState } from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';

const PollDetailBasicPhotoAnswerComponent = ({ items, hasUrl }) => {
    return (
        <div className="justify-content-center text-center">
            {items.map((item, index) => (
                /*<MokaInput
                    as="imageFile"
                    className="mb-2"
                    name="chnlImgMobFile"
                    isInvalid={null}
                    key={index}
                    inputProps={{
                        height: 80,
                        width: 80,
                        // width: 600, // width: '100%' number type 에러남.
                        //img: `${PDS_URL}${item.imgPath}${item.imgName}`,
                        img: '',
                        selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                        onClick: () => {
                            console.log('hhhhhhhhhh');
                        },
                    }}
                />*/
                <PollPhotoComponent key={index} width="100px" height="100px" src={item.imgUrl}>
                    150x150
                </PollPhotoComponent>
            ))}
        </div>
    );
};

export default PollDetailBasicPhotoAnswerComponent;
