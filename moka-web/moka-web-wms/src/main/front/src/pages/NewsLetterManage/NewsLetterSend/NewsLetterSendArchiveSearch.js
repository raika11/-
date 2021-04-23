import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaSearchInput } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 관리 > 수동 발송 아카이브 검색
 */
const NewsLetterSendArchiveSearch = () => {
    return (
        <Form className="mb-14">
            <MokaSearchInput className="flex-fill" placeholder="뉴스레터명을 입력하세요" disabled />
        </Form>
    );
};

export default NewsLetterSendArchiveSearch;
