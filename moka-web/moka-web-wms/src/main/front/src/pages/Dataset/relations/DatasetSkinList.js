import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaCard, MokaInput } from '@components';
import AgGrid from './DatasetSkinAgGrid';

/**
 * 관련 본문스킨
 */
const DatasetSkinList = () => {
    const history = useHistory();

    return (
        <MokaCard titleClassName="h-100 mb-0" title="본문스킨 검색">
            <Form>
                <MokaInput as="select">
                    <option>도메인선택</option>
                </MokaInput>
            </Form>
            <div className="d-flex justify-content-end mt-2">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push('/skin');
                    }}
                >
                    본문스킨 추가
                </Button>
            </div>
            <AgGrid />
        </MokaCard>
    );
};

export default DatasetSkinList;
