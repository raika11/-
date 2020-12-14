import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaInput } from '@components';
import { changeVodOptions } from '@store/bright';

const LiveOptionRenderer = forwardRef((props, ref) => {
    const { data } = props;
    const dispatch = useDispatch();

    const { vodOptions } = useSelector((store) => ({
        vodOptions: store.bright.vodOptions,
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
            dispatch(changeVodOptions({ key: data.id, value: nop }));
        },
        [data.id, dispatch, vodOptions],
    );

    return (
        <div className="d-flex">
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
        </div>
    );
});

export default LiveOptionRenderer;
