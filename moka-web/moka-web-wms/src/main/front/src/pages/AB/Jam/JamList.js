import React from 'react';
import { ABSearch, ABTestAgGrid, StatusBar } from '../components';
import JamAgGridColumns from '@pages/AB/Jam/JamAgGridColumns';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';

/**
 * A/B 테스트 > JAM 설계 > 리스트
 */
const JamList = (props) => {
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
            <ABTestAgGrid columnDefs={JamAgGridColumns} />
        </React.Fragment>
    );
};

export default JamList;
