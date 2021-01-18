import React, { useRef, useCallback } from 'react';

const RcvProgsRenderer = (props) => {
    const { value, onClick, data, colDef } = props;
    const valueRef = useRef(null);

    let cn = value === '실패' ? 'mb-0 color-primary' : 'mb-0';
    let dtKey = `${colDef.field}Dt`;

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            // console.log(data);
            if (onClick) {
                onClick(value);
            }
        },
        [onClick, value],
    );

    return (
        <>
            <p ref={valueRef} className={cn} onClick={handleClick}>
                {value}
            </p>
            {Object.keys(data).includes(dtKey) && <p className="mb-0">{data[dtKey]}</p>}
        </>
    );
};

export default RcvProgsRenderer;
