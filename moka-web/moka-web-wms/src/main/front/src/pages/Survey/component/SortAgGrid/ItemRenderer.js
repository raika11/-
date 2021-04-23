import React, { useState, useEffect, useRef } from 'react';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTableEditCancleButton, MokaInputLabel, MokaInput } from '@components';
import { selectArticleItemChange, selectArticleListChange, clearSelectArticleList } from '@store/survey/quiz';

const labelWidth = 45;

/**
 * 관련 기사 렌더러
 */
const ItemRenderer = ({ value }) => {
    const selectId = useRef(null);
    const dispatch = useDispatch();
    const [editData, setEditData] = useState({
        id: 0,
        title: '',
        linkUrl: '',
        targetType: '',
    });

    const { selectArticleItem, selectArticleList } = useSelector((store) => ({
        selectArticleItem: store.quiz.selectArticle.item,
        selectArticleList: store.quiz.selectArticle.list,
    }));

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        let newData = {
            ...editData,
            [name]: value,
        };
        setEditData(newData);

        const nextState = produce(selectArticleItem, (draft) => {
            draft[selectId.current] = newData;
        });
        dispatch(selectArticleItemChange(nextState));
    };

    const handleClickDelete = () => {
        // value.delete(selectId.current);
        dispatch(clearSelectArticleList());
        setTimeout(function () {
            dispatch(selectArticleListChange(selectArticleList.filter((e, index) => index !== Number(selectId.current))));
            dispatch(selectArticleItemChange(selectArticleItem.filter((e, index) => index !== Number(selectId.current))));
        }, 10);
    };

    useEffect(() => {
        const setEditDataRow = (data) => {
            if (data) {
                setEditData({
                    ...editData,
                    id: selectId.current,
                    title: data.title,
                    linkUrl: data.linkUrl,
                    linkTarget: data.linkTarget,
                });
            }
        };

        if (!isNaN(Number(value.id))) {
            selectId.current = value.id;
            setEditDataRow(selectArticleItem[Number(value.id)]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectArticleItem]);

    return (
        <div className="h-100 w-100 d-flex py-10">
            <div className="flex-fill">
                <MokaInputLabel name="title" label="타이틀" labelWidth={labelWidth} onChange={(e) => handleChangeValue(e)} value={editData.title} className="mb-1" />
                <div className="d-flex align-items-center">
                    <MokaInputLabel name="linkUrl" label="URL" labelWidth={labelWidth} onChange={(e) => handleChangeValue(e)} value={editData.linkUrl} className="mr-1 flex-fill" />
                    <div className="flex-shrink-0 d-flex align-items-center">
                        <MokaInput as="select" name="linkTarget" value={editData.linkTarget} onChange={(e) => handleChangeValue(e)}>
                            <option value="S">본창</option>
                            <option value="N">새창</option>
                        </MokaInput>
                    </div>
                </div>
            </div>
            <div className="mr-12 ml-10" style={{ width: 13 }}>
                <MokaTableEditCancleButton onClick={handleClickDelete} />
            </div>
        </div>
    );
};

export default ItemRenderer;
