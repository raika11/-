import React from 'react';
import { BeatLoader } from 'react-spinners';
import clsx from 'clsx';
import {Paperclip} from "react-feather";


const MokaLoader = (props) => {
    const { overrideClassName, size } = props;

    return (
        <Paperclip square elevation={0}>
            <BeatLoader size={size} margin={5} />
        </Paperclip>
    );
};

export default MokaLoader;
