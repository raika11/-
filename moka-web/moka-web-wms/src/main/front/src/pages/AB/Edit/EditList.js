import React, { useEffect } from 'react';
import { ABSearch, ABAgGrid, StatusBar } from '../components';
import EditAgGridColumns from '@pages/AB/Edit/EditAgGridColumns';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GET_AB_TEST_LIST, getAbTestList, SAVE_AB_TEST } from '@store/ab/abAction';
import { ABTEST_TYPE } from '@store/ab/abReducer';

/**
 * A/B 테스트 > 대안 설계 > 리스트
 */
const EditList = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { match } = props;

    const search = useSelector(({ ab }) => ab.search);
    const list = useSelector(({ ab }) => ab.list);
    const total = useSelector(({ ab }) => ab.total);
    const abtestSeq = useSelector(({ ab }) => ab.ab.abtestSeq);
    const loading = useSelector(({ loading }) => loading[GET_AB_TEST_LIST] || loading[SAVE_AB_TEST]);

    const handleClickRow = ({ seq }) => {
        history.push(`/ab-edit/${seq}`);
    };

    useEffect(() => {
        dispatch(getAbTestList({ ...search, abtestType: ABTEST_TYPE.ALTERNATIVE_INPUT }));
    }, [search, dispatch]);

    return (
        <React.Fragment>
            <ABSearch {...props} />
            <Row className="mb-14 justify-content-between" noGutters>
                <StatusBar />
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    설계 등록
                </Button>
            </Row>
            <ABAgGrid rowData={list} searchOptions={search} total={total} columnDefs={EditAgGridColumns} onRowClicked={handleClickRow} selected={abtestSeq} loading={loading} />
        </React.Fragment>
    );
};

export default EditList;
