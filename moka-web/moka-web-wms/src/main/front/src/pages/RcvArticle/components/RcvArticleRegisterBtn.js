import React, { useImperativeHandle, forwardRef, useState } from 'react';
import Button from 'react-bootstrap/Button';

const RcvArticleRegisterBtn = forwardRef(({ data }, ref) => {
    const [serviceDaytime] = useState(data.serviceDaytime);

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return !serviceDaytime ? (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <Button variant="outline-table-btn" size="sm" onClick={() => data.handleRegister(data)}>
                등록
            </Button>
        </div>
    ) : null;
});

export default RcvArticleRegisterBtn;
