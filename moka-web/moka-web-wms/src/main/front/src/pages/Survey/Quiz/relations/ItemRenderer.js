import React, { useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTableEditCancleButton, MokaInputLabel } from '@components';
import { selectQuizChange } from '@store/survey/quiz';

const replaceNo = (t) => ('00' + t).slice(-2);

const ItemRenderer = forwardRef((params, ref) => {
    const [item, setItem] = React.useState(params.data);
    const dispatch = useDispatch();
    const selectQuiz = useSelector(({ quiz }) => quiz.selectQuiz);

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        const newList = selectQuiz.filter((quiz) => String(quiz.quizSeq) !== String(item.contentId));
        dispatch(selectQuizChange(newList));
    };

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setItem(params.data);
            return true;
        },
    }));

    return (
        <div className="d-flex h-100">
            <div className="flex-shrink-0 d-flex align-items-center mr-12">{replaceNo(item.ordNo)}</div>
            <MokaInputLabel name="title" id={`title-${item.contentId}`} inputClassName="bg-white" labelWidth={30} value={item.title} className="flex-fill" disabled />
            <div className="mr-12 ml-10" style={{ width: 13 }}>
                <MokaTableEditCancleButton onClick={handleClickDelete} />
            </div>
        </div>
    );
});

export default ItemRenderer;
