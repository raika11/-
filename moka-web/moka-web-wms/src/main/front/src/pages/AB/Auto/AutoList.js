import React, { useEffect } from 'react';
import { ABSearch, StatusBar } from '../components';
import ABAgGrid from '@pages/AB/components/ABAgGrid';
import AutoAgGridColumns from '@pages/AB/Auto/AutoAgGridColumns';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, getAbTestList } from '@store/ab/abAction';
import { ABTEST_TYPE } from '@store/ab/abReducer';

/**
 * A/B 테스트 > 직접 설계 > 리스트
 */
const AutoList = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { match } = props;

    const { search, list, total } = useSelector(({ ab }) => ab);

    const handleClickRow = ({ seq }) => {
        history.push(`/ab-auto/${seq}`);
    };

    const handleChangeSearchOption = (option) => {
        dispatch(changeSearchOption({ ...search, [option.key]: option.value }));
    };

    useEffect(() => {
        dispatch(getAbTestList({ ...search, abtestType: ABTEST_TYPE.DIRECT_DESIGN }));
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
            <ABAgGrid
                rowData={list}
                searchOptions={search}
                total={total}
                columnDefs={AutoAgGridColumns}
                onRowClicked={handleClickRow}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </React.Fragment>
    );
};

export default AutoList;
