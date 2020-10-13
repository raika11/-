import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ProgressBarComponent = (props) => {
    const { now, label, variant, striped, animated, multi, ...rest } = props;
    const [barList, setBarList] = useState([]);

    useEffect(() => {
        /** Bar items */
        if (multi) {
            setBarList(multi.map((i, idx) => <ProgressBar key={idx} now={i.now} label={`${i.now}%`} variant={i.variant} striped={i.striped} animated={i.animated} />));
        }
    }, [multi]);

    return (
        <>
            <ProgressBar now={now} label={`${now}%`} variant={variant} striped={striped && true} animated={animated && true} {...rest}>
                {multi && barList}
            </ProgressBar>
        </>
    );
};

export default ProgressBarComponent;
