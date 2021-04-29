import React, { useEffect } from 'react';
import { ABSearch, StatusBar } from '../components';
import ABAgGrid from '@pages/AB/components/ABAgGrid';
import ABAgGridColumns from '@pages/AB/AB/ABAgGridColumns';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { getAbTestList } from '@store/ab/abAction';
import { useHistory } from 'react-router-dom';

/**
 * A/B 테스트 > 전체 목록 > 리스트
 */
const ABList = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { search, list } = useSelector(({ ab }) => ab);

    const handleClickRow = ({ seq }) => {
        history.push(`/ab/${seq}`);
    };

    useEffect(() => {
        dispatch(getAbTestList(search));
    }, [search, dispatch]);

    return (
        <React.Fragment>
            <ABSearch {...props} />
            <Row className="mb-14 justify-content-between" noGutters>
                <StatusBar />
                <Button variant="positive">설계 복사</Button>
            </Row>
            <ABAgGrid rowData={list} searchOptions={search} columnDefs={ABAgGridColumns} onRowClicked={handleClickRow} />
        </React.Fragment>
    );
};

export default ABList;
