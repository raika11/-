import React from 'react';
import { BeatLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const MokaLoader = (props) => {
    const { size, clsOpt } = props;

    return (
        <div className={clsx('opacity-box', clsOpt)}>
            <BeatLoader size={size} margin={5} />
        </div>
    );
};

export default MokaLoader;
