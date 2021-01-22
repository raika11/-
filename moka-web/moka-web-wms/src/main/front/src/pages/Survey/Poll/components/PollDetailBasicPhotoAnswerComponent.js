import React, { useEffect, useRef, useState } from 'react';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import produce from 'immer';

const PollDetailBasicPhotoAnswerComponent = ({ item, index, hasUrl }) => {
    const [edit, setEdit] = useState({ imgUrl: '', imgFile: null });

    const handleChangeFile = (acceptedFiles) => {
        setEdit(
            produce(edit, (draft) => {
                draft.imgUrl = null;
                draft.imgFile = acceptedFiles;
            }),
        );
    };

    useEffect(() => {
        console.log(edit);
    }, [edit]);

    useEffect(() => {
        setEdit(item);
    }, [item]);
    return (
        <div className="d-inline-flex flex-column">
            <PollPhotoComponent key={index} width="100px" height="100px" src={edit.imgUrl} onChange={handleChangeFile}>
                150x150
            </PollPhotoComponent>
            <div className="text-center">{`보기 ${index + 1}`}</div>
        </div>
    );
};

export default PollDetailBasicPhotoAnswerComponent;
