import React, { useState, useEffect } from 'react';
import { NewIcon } from '@components';

const ListTitleRenderer = (params) => {
    const paramValue = params.value;
    useEffect(() => {}, [paramValue]);
    return (
        <>
            <div className="pt-01" style={{ minHeight: 55 }}>
                <div className="d-flex">
                    <p className="pt-01 pl-01 mb-0 flex-fill text-truncate">{paramValue.article}</p>
                </div>
                <div className="d-flex">
                    <p className="pt-01 pl-01 mb-0 flex-fill h5 text-truncate">
                        <NewIcon width={10} height={10} className="ml-1" />
                        {paramValue.sns}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ListTitleRenderer;
