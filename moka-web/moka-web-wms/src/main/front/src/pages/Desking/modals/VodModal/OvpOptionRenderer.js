import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaInput } from '@components';
import { changeVodOptions } from '@store/bright';

const OvpOptionRenderer = forwardRef((props, ref) => {
    const { data } = props;
    const dispatch = useDispatch();
    const { vodOptions } = useSelector(({ bright }) => ({
        vodOptions: bright.vodOptions,
    }));

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => false,
        }),
        [],
    );

    const handleChangeValue = useCallback(
        (e) => {
            const { name, checked } = e.target;
            const nop = {
                ...vodOptions[data.id],
                [name]: checked,
            };

            // ag-grid 셀의 value가 무엇을 의미하는지 모르겠음 getValue, setValue 쓸 줄 알게되면 그때 처리... 지금은 스토어에 저장
            // setValue({ vid: data.id, op: nop });
            dispatch(changeVodOptions({ key: data.id, value: nop }));
        },
        [data.id, dispatch, vodOptions],
    );

    return (
        <div className="w-100 h-100 d-flex flex-column">
            <MokaInput
                as="checkbox"
                name="autoplay"
                id={`${data.id}-autoplay`}
                onChange={handleChangeValue}
                inputProps={{ label: '자동재생', custom: true, checked: vodOptions[data.id]?.autoplay || false }}
            />
            <MokaInput
                as="checkbox"
                name="muteFirstPlay"
                id={`${data.id}-muteFirstPlay`}
                onChange={handleChangeValue}
                inputProps={{ label: '음소거', custom: true, checked: vodOptions[data.id]?.muteFirstPlay || false }}
            />
            <MokaInput
                as="checkbox"
                name="loop"
                id={`${data.id}-loop`}
                onChange={handleChangeValue}
                inputProps={{ label: '반복재생', custom: true, checked: vodOptions[data.id]?.loop || false }}
            />
        </div>
    );
});

export default OvpOptionRenderer;
