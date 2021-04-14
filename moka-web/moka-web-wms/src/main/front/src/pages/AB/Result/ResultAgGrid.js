import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { GRID_HEADER_HEIGHT } from '@/style_constants';
import { MokaTable } from '@components';
import columnDefs from './ResultAgGridColumns';

/**
 * A/B 테스트 > 테스트 결과 > 리스트 > AgGrid
 */
const ResultAgGrid = () => {
    return (
        <React.Fragment>
            <Row className="mb-14 justify-content-end" noGutters>
                <Button variant="positive" onClick={() => {}}>
                    다운로드
                </Button>
            </Row>

            <MokaTable headerHeight={GRID_HEADER_HEIGHT[1]} className="overflow-hidden flex-fill" columnDefs={columnDefs} onRowNodeId={(data) => data.seq} />
        </React.Fragment>
    );
};

export default ResultAgGrid;
