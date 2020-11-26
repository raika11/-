import React, { useState, useEffect } from 'react';
import { faAddressBook, faDiceTwo } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListTitleRenderer = (params) => {
    const paramValue = params.value;

    const status = 'Y';
    let clazz = status === 'Y' ? 'color-negative' : '';

    useEffect(() => {}, [paramValue]);
    return (
        <>
            <div className="p-03 border-top" style={{ minHeight: 55 }}>
                <div className="d-flex justify-content-between">
                    <p className="pt-01 pl-01 mb-0 flex-fill text-truncate">{paramValue.article}</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="pt-01 pl-01 mb-0 flex-fill h5 text-truncate">
                        <FontAwesomeIcon icon={faAddressBook} fixedWidth className={clazz} />
                        {paramValue.sns}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ListTitleRenderer;
