import React, { useCallback, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { MokaInput } from '@components';

const ovpOptionRenderer = forwardRef((props, ref) => {
    const { data: initialData } = props;
    const [data, setData] = useState(initialData);
    const [options, setOptions] = useState({});

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setData(params.data);
            return true;
        },
    }));

    const handleChangeValue = useCallback(
        (e) => {
            const { name, checked } = e.target;

            setOptions({
                ...options,
                [name]: checked,
            });
        },
        [options],
    );

    useEffect(() => {
        const { id, videoId, options } = data;

        if (id === videoId) {
            setOptions(options);
        }
    }, [data]);

    return (
        <div className="d-flex flex-column">
            <MokaInput
                as="checkbox"
                value={options.autoplay}
                name="autoplay"
                id={`${data.id}-autoplay`}
                onChange={handleChangeValue}
                inputProps={{ label: '자동재생', custom: true }}
            />
            <MokaInput
                as="checkbox"
                value={options.muteFirstPlay}
                name="muteFirstPlay"
                id={`${data.id}-muteFirstPlay`}
                onChange={handleChangeValue}
                inputProps={{ label: '음소거', custom: true }}
            />
            <MokaInput as="checkbox" value={options.loop} name="loop" id={`${data.id}-loop`} onChange={handleChangeValue} inputProps={{ label: '반복재생', custom: true }} />
        </div>
    );
});

export default ovpOptionRenderer;
