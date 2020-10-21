import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaCard, MokaInputLabel } from '@components';
import AgGrid from './DatasetPageAgGrid';

/**
 * 관련페이지 컴포넌트
 */
const DatasetPageList = () => {
    const history = useHistory();

    return (
        <MokaCard titleClassName="h-100 mb-0" title="페이지 검색">
            <Form>
                <MokaInputLabel as="select">
                    <option>도메인선택</option>
                </MokaInputLabel>
            </Form>
            <div className="d-flex justify-content-end mt-2">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push('/page');
                    }}
                >
                    페이지 추가
                </Button>
            </div>
            <AgGrid />
        </MokaCard>
    );
};

export default DatasetPageList;
