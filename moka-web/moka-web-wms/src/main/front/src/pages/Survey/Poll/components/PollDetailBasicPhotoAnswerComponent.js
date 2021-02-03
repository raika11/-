import React, { useEffect, useState } from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import produce from 'immer';

const PollDetailBasicPhotoAnswerComponent = ({ item, index, hasUrl, onChange }) => {
    const [editItem, setEditItem] = useState({ imgUrl: null, imgFile: null });

    const handleChangeValue = (name, value, type) => {
        const changeItem = produce(editItem, (draft) => {
            if (type === 'file') {
                draft['imgUrl'] = null;
            }
            draft[name] = value;
        });

        setEditItem(changeItem);
        if (onChange instanceof Function) {
            onChange(changeItem);
        }
    };

    /*useEffect(() => {
        console.log(editItem);
    }, [editItem]);*/

    useEffect(() => {
        setEditItem(item);
    }, [item]);
    return (
        <div className="d-inline-flex flex-column">
            <PollPhotoComponent
                key={index}
                width="100px"
                height="100px"
                src={editItem.imgUrl}
                onChange={(file) => {
                    handleChangeValue('imgFile', file, 'file');
                }}
            >
                150x150
            </PollPhotoComponent>
            <div className="text-center">{`보기 ${index + 1}`}</div>
        </div>
    );
};

export default PollDetailBasicPhotoAnswerComponent;
