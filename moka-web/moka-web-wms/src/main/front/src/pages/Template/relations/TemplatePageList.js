import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard } from '@components';

/**
 * 관련 페이지
 */
const TemplatePageList = () => {
    const history = useHistory();

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="페이지 검색">
            <div className="d-flex justify-content-end">
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

export default TemplatePageList;
