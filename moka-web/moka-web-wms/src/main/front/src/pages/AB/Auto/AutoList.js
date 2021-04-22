import React from 'react';
import { ABSearch, StatusBar } from '../components';
import ABAgGrid from '@pages/AB/components/ABAgGrid';
import AutoAgGridColumns from '@pages/AB/Auto/AutoAgGridColumns';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';

/**
 * A/B 테스트 > 직접 설계 > 리스트
 */
const AutoList = (props) => {
    const { match } = props;
    const history = useHistory();

    return (
        <React.Fragment>
            <ABSearch {...props} />
            <Row className="mb-14 justify-content-between" noGutters>
                <StatusBar />
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    설계 등록
                </Button>
            </Row>
            <ABAgGrid columnDefs={AutoAgGridColumns} />
        </React.Fragment>
    );
};

export default AutoList;
