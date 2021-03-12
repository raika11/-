import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

/**
 * 404 Page
 * @param {string} param0.defaultLink 기본링크
 */
const Page404 = ({ defaultLink }) => (
    <div className="d-flex h-100 justify-content-center align-items-center">
        <div className="text-center">
            {/*<h1 className="display-1 font-weight-bold">404</h1>*/}
            <p className="h1">페이지를 찾을 수 없습니다..</p>
            <p className="h2 font-weight-normal mt-3 mb-2">페이지가 없거나 오류가 발생하였습니다. 이용에 불편을 드려 죄송합니다.</p>
            <p className="h2 font-weight-normal mb-4">입력하신 주소가 정확한지 확인 후 다시 시도해 주시기 바랍니다.</p>
            <Link to={defaultLink || '/dashboard'}>
                <Button color="primary" size="lg">
                    메인 페이지로 돌아가기
                </Button>
            </Link>
        </div>
    </div>
);

export default Page404;
