import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard } from '@components';

import AgGrid from './TemplateContainerAgGrid';

/**
 * 관련 컨테이너
 */
const TemplateContainerList = (props) => {
    const { show } = props;
    const history = useHistory();

    return (
        <MokaCard titleClassName="mb-0" title="컨테이너 검색">
            {/* 버튼 */}
            <div className="d-flex justify-content-end mb-3">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push('/container');
                    }}
                >
                    컨테이너 추가
                </Button>
            </div>

            {/* 목록 및 페이징 */}
            <AgGrid show={show} />
        </MokaCard>
    );
};

export default TemplateContainerList;
