import React from 'react';
import { ColumnTwo } from '~/layouts';
import ComponentTest from './ComponentTest';

const Dashboard = (props) => {
    return (
        <ColumnTwo {...props} sidebarSize="normal" widthOne="600">
            <ComponentTest />
            <div></div>
            <div></div>
            <div>ddd</div>
        </ColumnTwo>
    );
};

export default Dashboard;
