import React, { useState, useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { MokaInputLabel, MokaInput } from '@components';
import { MokaTableEditCancleButton } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';

import { selectArticleItemChange, selectArticleListChange, clearSelectArticleList } from '@store/survey/quiz';

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
        }, 10);
    };

    useEffect(() => {
        const setEditDataRow = (data) => {
            setEditData({
                ...editData,
                id: selectId.current,
                title: data.title,
                linkUrl: data.linkUrl,
                targetType: data.targetType,
            });
        };

        if (!isNaN(Number(value.id))) {
            selectId.current = value.id;
            setEditDataRow(selectArticleItem[Number(value.id)]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectArticleItem]);

    useEffect(() => {
        // console.log(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    useEffect(() => {
        // console.log(editData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData]);

    return (
        <Row>
            {!isNaN(Number(editData.id)) && (
                <>
                    <Col className="align-self-center justify-content-start mb-0 pr-0 pl-3 w-100">{!isNaN(Number(editData.id)) && Number(editData.id) + 1}</Col>
                    <Col className="d-felx" xs={10}>
                        <Row className="d-felx">
                            <MokaInputLabel
                                name="title"
                                id="title"
                                label="타이틀"
                                onChange={(e) => handleChangeValue(e)}
                                labelWidth={30}
                                value={editData.title}
                                className="col mb-0 pl-0 pr-0"
                            />
                        </Row>
                        <Row className="d-felx">
                            <MokaInputLabel
                                name="linkUrl"
                                id="linkUrl"
                                label="url"
                                onChange={(e) => handleChangeValue(e)}
                                labelWidth={30}
                                value={editData.linkUrl}
                                className="col mb-0 pl-0 pr-0"
                            />
                            <Col className="d-felx mb-0 pl-1 pr-0" xs={3}>
                                <MokaInput as="select" name="targetType" id="targetType" value={editData.targetType} onChange={(e) => handleChangeValue(e)}>
                                    <option value="one">본창</option>
                                    <option value="two">새창</option>
                                </MokaInput>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="d-felx align-self-center text-left mb-0 pl-0">
                        <MokaTableEditCancleButton onClick={() => handleClickDelete()} />
                    </Col>
                </>
            )}
        </Row>
    );
};

export default ItemRenderer;
// const ItemRenderer = ({ value }) => {
//     const [itemData, setItemData] = useState({
//         contentId: '',
//         index: '',
//         title: '',
//         linkUrl: '',
//         targetType: '',
//     });

//     const handleChangeValue = () => {};

//     const handleClickDelete = () => {};

//     useEffect(() => {
//         setItemData({
//             contentId: value.contentId,
//             index: value.index,
//             title: value.title,
//             linkUrl: value.linkUrl,
//             targetType: value.targetType,
//         });
//     }, [value]);

//     return (
//         <>
//             <Row>
//                 <Col className="align-self-center justify-content-start mb-0 pr-0 pl-3 w-100">{Number(itemData.index) + 1}</Col>
//                 <Col className="d-felx" xs={10}>
//                     <Row className="d-felx">
//                         <MokaInputLabel
//                             name="title"
//                             label="타이틀"
//                             onChange={(e) => {
//                                 handleChangeValue(e.target);
//                             }}
//                             labelWidth={30}
//                             value={itemData.title}
//                             className="col mb-0 pl-0 pr-0"
//                         />
//                     </Row>
//                     <Row className="d-felx">
//                         <MokaInputLabel
//                             name="linkUrl"
//                             label="url"
//                             onChange={(e) => {
//                                 handleChangeValue(e.target);
//                             }}
//                             labelWidth={30}
//                             value={itemData.linkUrl}
//                             className="col mb-0 pl-0 pr-0"
//                         />
//                         <Col className="d-felx mb-0 pl-1 pr-0" xs={3}>
//                             <MokaInput
//                                 as="select"
//                                 name="targetType"
//                                 value={itemData.targetType}
//                                 onChange={(e) => {
//                                     handleChangeValue(e.target);
//                                 }}
//                             >
//                                 <option value="one">본창</option>
//                                 <option value="two">새창</option>
//                             </MokaInput>
//                         </Col>
//                     </Row>
//                 </Col>
//                 <Col className="d-felx align-self-center text-left mb-0 pl-0">
//                     <MokaTableEditCancleButton onClick={() => handleClickDelete()} />
//                 </Col>
//             </Row>
//         </>
//     );
// };

// export default ItemRenderer;
