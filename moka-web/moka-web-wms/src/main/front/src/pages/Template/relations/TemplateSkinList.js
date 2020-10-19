import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard } from '@components';

import AgGrid from './TemplateSkinAgGrid';

/**
 * 관련 본문스킨
 */
const TemplateSkinList = () => {
    const history = useHistory();

    return (
        <MokaCard titleClassName="mb-0" title="본문스킨 검색">
            {/* 버튼 */}
            <div className="d-flex justify-content-end mb-3">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push('/skin');
                    }}
                >
                    본문스킨 추가
                </Button>
            </div>
            {/* 목록 및 페이징 */}
            <AgGrid />
        </MokaCard>
    );
};

export default TemplateSkinList;
