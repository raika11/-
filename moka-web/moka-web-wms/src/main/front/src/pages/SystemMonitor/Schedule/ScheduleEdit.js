import React from 'react';
import { RunStateSearchList } from './RunState';
import { WorkEdit } from './Work';
import { DeleteWorkEdit } from './DeleteWork';
import { DeployServerEdit } from './DeployServer';
import { BackOfficeWorkEdit } from './BackOfficeWork';

const ScheduleEdit = ({ match, activeKey }) => {
    return (
        <>
            {Number(activeKey) === 0 && <RunStateSearchList match={match} show={Number(activeKey) === 0} />}
            {Number(activeKey) === 1 && <WorkEdit match={match} />}
            {Number(activeKey) === 2 && <DeleteWorkEdit match={match} />}
            {Number(activeKey) === 3 && <DeployServerEdit match={match} />}
            {Number(activeKey) === 4 && <BackOfficeWorkEdit match={match} />}
        </>
    );
};

export default ScheduleEdit;
