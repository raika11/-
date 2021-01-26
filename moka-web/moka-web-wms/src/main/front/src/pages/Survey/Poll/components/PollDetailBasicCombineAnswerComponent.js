import React, { useEffect, useState } from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import { MokaInput } from '@components';
import produce from 'immer';

const PollDetailBasicCombineAnswerComponent = ({ item, index, hasUrl, onChange }) => {
    const [editItem, setEditItem] = useState({ title: '', url: '', imgUrl: '', imgFile: '' });

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

    useEffect(() => {
        setEditItem(item);
    }, [item]);

    return (
        <div className="d-flex align-items-center" key={index}>
            <PollPhotoComponent
                width={110}
                height={110}
                src={editItem.imgUrl}
                onChange={(file) => {
                    handleChangeValue('imgFile', file, 'file');
                }}
            />
            <div className="d-inline-flex flex-fill h-100 flex-column">
                <div className="m-2">
                    <MokaInput
                        name="title"
                        placeholder={`보기 ${index + 1} (20자 이내로 입력하세요)`}
                        value={editItem.title}
                        onChange={(e) => {
                            const { name, value, type } = e.target;
                            handleChangeValue(name, value, type);
                        }}
                    />
                </div>
                {(hasUrl || item.linkUrl) && (
                    <div className="m-2">
                        <MokaInput
                            name="linkUrl"
                            placeholder="url"
                            value={editItem.linkUrl}
                            onChange={(e) => {
                                const { name, value, type } = e.target;
                                handleChangeValue(name, value, type);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollDetailBasicCombineAnswerComponent;
