import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import columnDefs from './ABAgGridColumns';
import { StatusRenderer, StatusBar } from '../components';

/**
 * A/B 테스트 > 전체 목록 > 리스트 > AgGrid
 */
const ABAgGrid = () => {
    return (
        <React.Fragment>
            <Row className="mb-14 justify-content-between" noGutters>
                <StatusBar />
                <Button variant="positive">설계 복사</Button>
            </Row>

            <MokaTable
                headerHeight={45}
                rowHeight={43}
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                onRowNodeId={(data) => data.seq}
                frameworkComponents={{ statusRenderer: StatusRenderer }}
            />
        </React.Fragment>
    );
};

export default ABAgGrid;
