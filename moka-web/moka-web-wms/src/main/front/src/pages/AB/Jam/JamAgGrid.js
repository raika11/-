import React from 'react';
import { useHistory } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { GRID_HEADER_HEIGHT } from '@/style_constants';
import { MokaTable } from '@components';
import columnDefs from './JamAgGridColumns';
import { StatusRenderer, StatusBar } from '../components';

/**
 * A/B 테스트 > JAM 설계 > 리스트 > AgGrid
 */
const JamAgGrid = ({ match }) => {
    const history = useHistory();

    return (
        <React.Fragment>
            <Row className="mb-14 justify-content-between" noGutters>
                <StatusBar />
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    설계 등록
                </Button>
            </Row>

            <MokaTable
                headerHeight={GRID_HEADER_HEIGHT[1]}
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                onRowNodeId={(data) => data.seq}
                frameworkComponents={{ statusRenderer: StatusRenderer }}
            />
        </React.Fragment>
    );
};

export default JamAgGrid;
