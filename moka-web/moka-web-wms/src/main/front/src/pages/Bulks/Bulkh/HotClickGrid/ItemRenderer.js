import React, { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTableEditCancleButton } from '@components';
import { changeHotClickList, clearHotclicklist } from '@store/bulks';

const ItemRenderer = ({ itemIndex, title, url }) => {
    const dispatch = useDispatch();
    const { hotClickList } = useSelector((store) => ({
        hotClickList: store.bulks.bulkh.hotclickList.list,
    }));

    // 임시.
    const handleChangeBulkinputBox = () => {
        return;
    };

    // 삭제 버튼 클릭시 store 변경 처리.
    const handleClickCancleButton = useCallback(() => {
        // 삭제 하고 난후에 바로 state 를 업데이트 하면 grid row 렌더링과 곂쳐 져서 에러가 남.
        // 시간을 주고 업데이트를 시킴
        dispatch(clearHotclicklist());
        setTimeout(function () {
            dispatch(
                changeHotClickList(
                    hotClickList.filter(function (e, index) {
                        return index !== itemIndex;
                    }),
                ),
            );
        }, 10);
        // #3
    }, [dispatch, hotClickList, itemIndex]);

    return (
        <>
            <Row>
                <Col className="align-self-center justify-content-start mb-0 pr-0 pl-2 w-100">{itemIndex + 1}</Col>
                <Col className="d-felx" xs={10}>
                    <MokaInputLabel
                        name="title"
                        id="title"
                        label="타이틀"
                        onChange={(e) => handleChangeBulkinputBox(e)}
                        labelWidth={30}
                        value={title}
                        className="col mb-0 pl-0 pr-0"
                    />
                    <MokaInputLabel name="url" id="url" label="url" onChange={(e) => handleChangeBulkinputBox(e)} labelWidth={30} value={url} className="col mb-0 pl-0 pr-0" />
                </Col>
                <Col className="d-felx align-self-center text-left mb-0 pl-0">
                    <MokaTableEditCancleButton onClick={handleClickCancleButton} />
                </Col>
            </Row>
        </>
    );
};

export default ItemRenderer;
