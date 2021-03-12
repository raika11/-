import React from 'react';
import Button from 'react-bootstrap/Button';
import { logout } from '@store/auth';
import { useDispatch } from 'react-redux';

/**
 * 403 Page
 * @param {string} param0.defaultLink 기본링크
 */
const Page403 = ({ defaultLink }) => {
    const dispatch = useDispatch();
    return (
        <div className="d-flex h-100 justify-content-center align-items-center">
            <div className="text-center">
                {/*<h1 className="display-1 font-weight-bold">403</h1>*/}
                <p className="h1">권한이 없습니다.</p>
                <p className="h2 font-weight-normal mt-3 mb-4">페이지에 대한 접근권한이 존재하지 않습니다.</p>
                <Button
                    color="primary"
                    size="lg"
                    onClick={() => {
                        dispatch(logout());
                    }}
                >
                    로그인 페이지로
                </Button>
                {/*</Link>*/}
            </div>
        </div>
    );
};

export default Page403;
