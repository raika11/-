import React, { useEffect, useState } from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import produce from 'immer';
import { MokaInput } from '@components';

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
        <div className="d-inline-flex flex-column m-2">
            <div className="text-left">{`보기 ${index + 1}`}</div>
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
            {hasUrl && (
                <div>
                    <MokaInput
                        name="linkUrl"
                        placeholder="url"
                        value={editItem.linkUrl}
                        onChange={(e) => {
                            const { name, value, type } = e.target;
                            handleChangeValue(name, value, type);
                        }}
                        inputProps={{ style: { width: '100px' }, title: editItem.linkUrl }}
                    />
                </div>
            )}
        </div>
    );
};

export default PollDetailBasicPhotoAnswerComponent;
