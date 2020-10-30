import React from 'react';
import { BeatLoader } from 'react-spinners';

const MokaLoader = (props) => {
    const { size } = props;

    return (
        <div className="opacity-box">
            <BeatLoader size={size} margin={5} />
        </div>
    );
};

export default MokaLoader;
