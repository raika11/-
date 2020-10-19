import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaCard, MokaInput } from '@components';

/**
 * 관련페이지 컴포넌트
 */
const DatasetPageList = () => {
    const history = useHistory();

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="페이지 검색">
            <Form>
                <MokaInput as="select">
                    <option>도메인선택</option>
                </MokaInput>
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
            AgGrid 영역
        </MokaCard>
    );
};

export default DatasetPageList;
