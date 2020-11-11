import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';

/**
 * 기사 검색
 */
const ArticleSearch = () => {
    return (
        <Form className="d-flex mb-2">
            <div style={{ width: 120 }} className="mr-2">
                <MokaInput as="select" disabled>
                    <option hidden>분류 전체</option>
                </MokaInput>
            </div>

            <div style={{ width: 120 }} className="mr-2">
                <MokaInput as="select" disabled>
                    <option hidden>매체 전체</option>
                </MokaInput>
            </div>

            <div style={{ width: 138 }} className="mr-2">
                <MokaInput as="dateTimePicker" className="ft-12" inputProps={{ timeFormat: null }} />
            </div>

            <div style={{ width: 138 }} className="mr-2">
                <MokaInput as="dateTimePicker" className="ft-12" inputProps={{ timeFormat: null }} />
            </div>

            <div style={{ width: 325 }} className="d-flex">
                <MokaSearchInput variant="dark" className="mr-2 flex-fill" disabled />
                <Button variant="gray150" className="ft-12">
                    초기화
                </Button>
            </div>
        </Form>
    );
};

export default ArticleSearch;
