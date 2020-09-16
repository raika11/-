import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const BreadcrumbComponent = () => {
    return (
        <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/test" active>
                test
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;
