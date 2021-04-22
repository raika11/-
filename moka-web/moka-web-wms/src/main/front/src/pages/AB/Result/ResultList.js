import React from 'react';
import { ABSearch, ABTestAgGrid } from '../components';
import ResultAgGridColumns from '@pages/AB/Result/ResultAgGridColumns';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

/**
 * A/B 테스트 > 테스트 결과 > 리스트
 */
const ResultList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <Row className="mb-14 justify-content-end" noGutters>
                <Button variant="positive" onClick={() => {}}>
                    다운로드
                </Button>
            </Row>
            <ABTestAgGrid columnDefs={ResultAgGridColumns} />
        </React.Fragment>
    );
};

export default ResultList;
