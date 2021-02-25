import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { MokaInputLabel } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTableEditCancleButton } from '@components';
import { changeHotClickList, changeHotClickListItem, clearHotclicklist } from '@store/bulks';

const ItemRenderer = forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const { hotClickList } = useSelector((store) => ({
        hotClickList: store.bulks.bulkh.hotclickList.list,
    }));

    const [data, setData] = useState(props.node.data);
    const [item, setItem] = useState({});

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeBulkinputBox = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
        if (data.onChange instanceof Function) {
            data.onChange({ ...item, [name]: value });
        }
        /*data.onChnage({ ...item, [name]: value });*/
    };

    /**
     * 삭제 버튼 클릭시 store 변경 처리
     */
    const handleClickCancle = useCallback(() => {
        // 삭제 하고 난후에 바로 state 를 업데이트 하면 grid row 렌더링과 곂쳐 져서 에러가 남.
        // 시간을 주고 업데이트를 시킴
        dispatch(clearHotclicklist());
        // setTimeout(function () {
        dispatch(
            changeHotClickList(
                hotClickList.filter(function (e, index) {
                    return index !== item.itemIndex;
                }),
            ),
        );
        // }, 20);
        // #3
    }, [dispatch, hotClickList, item.itemIndex]);

    useImperativeHandle(
        ref,
        () => ({
            refresh: (props) => {
                setData(props.node.data);
                return true;
            },
        }),
        [],
    );

    useEffect(() => {
        setItem(data?.item);
    }, [data]);

    return (
        <div className="h-100 w-100 d-flex py-1">
            <div className="flex-fill">
                <MokaInputLabel name="title" label="타이틀" onChange={handleChangeBulkinputBox} value={item.title} className="mb-1" />
                <MokaInputLabel name="url" label="URL" onChange={handleChangeBulkinputBox} value={item.url} />
            </div>
            <div className="h-100" style={{ width: 23 }}>
                <MokaTableEditCancleButton onClick={handleClickCancle} />
            </div>
        </div>
    );
});

export default ItemRenderer;
