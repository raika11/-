import React, { useState } from 'react';
import { WmsCard } from '~/components';
import VolumeTableContainer from './VolumeTableContainer';

const VolumeListContainer = (props) => {
    const { classes } = props;
    return (
        <WmsCard title="볼륨 관리">
            <VolumeTableContainer classes={classes} />
        </WmsCard>
    );
};

export default VolumeListContainer;
