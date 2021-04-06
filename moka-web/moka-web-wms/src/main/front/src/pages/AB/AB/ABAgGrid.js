import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { MokaIcon, MokaTable } from '@components';
import columnDefs from './ABAgGridColumns';
import StatusRenderer from '../components/StatusRenderer';

/**
 * A/B 테스트 > 전체 목록 > 리스트 > AgGrid
 */
const ABAgGrid = () => {
    return (
        <React.Fragment>
            <Row className="mb-14 justify-content-between" noGutters>
                <div className="d-flex align-items-center">
                    <span className="mr-3">
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-brand-a6 mr-1" />
                        진행
                    </span>
                    <span className="mr-3">
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-neutral mr-1" />
                        대기
                    </span>
                    <span className="mr-3">
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-gray-400 mr-1" />
                        임시
                    </span>
                    <span className="mr-3">
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-searching mr-1" />
                        종료
                    </span>
                </div>

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
