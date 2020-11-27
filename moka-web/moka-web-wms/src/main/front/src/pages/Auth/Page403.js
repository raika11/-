import React from 'react';
import Button from 'react-bootstrap/Button';

/**
 * 403 Page
 * @param {string} param0.defaultLink 기본링크
 */
const Page403 = ({ defaultLink }) => {
    return (
        <div className="d-flex h-100 justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-1 font-weight-bold">403</h1>
                <p className="h1">Forbidden</p>
                <p className="h2 font-weight-normal mt-3 mb-4">{`You don't have permission to ${defaultLink} access on this server`}</p>
                {/*<Link to={defaultLink || '/dashboard'}>*/}
                <Button color="primary" size="lg">
                    Return to website
                </Button>
                {/*</Link>*/}
            </div>
        </div>
    );
};

export default Page403;
