import React from 'react';
import clsx from 'clsx';

const AgGripIcon = ({ className, ...rest }) => {
    return (
        <div className={clsx('d-flex', className)} {...rest}>
            <span className="ag-icon ag-icon-grip" unselectable="on" role="presentation"></span>
        </div>
    );
};

export default AgGripIcon;
