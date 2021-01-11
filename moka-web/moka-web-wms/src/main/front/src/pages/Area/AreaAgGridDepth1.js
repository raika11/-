import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable } from '@components';
import {
    initialState,
    clearArea,
    getAreaListDepth1,
    getAreaListDepth2,
    clearList,
    changeSearchOptionDepth2,
    changeSelectedDepth,
    getAreaDepth1,
    GET_AREA_LIST_DEPTH1,
} from '@store/area';
import Depth2 from './AreaAgGridDepth2';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 첫번째 리스트
 */
const AreaAgGrid1D = ({ match, onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { areaSeq } = useParams();

    const list = useSelector((store) => store.area.depth1.list);
    const loading = useSelector((store) => store.loading[GET_AREA_LIST_DEPTH1]);

    // state
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                onDelete: onDelete,
            })),
        );
    }, [list, onDelete]);

    useEffect(() => {
        dispatch(getAreaListDepth1());

        // areaSeq가 있으면 2뎁스 리스트 조회 + 상세 데이터 조회
        if (areaSeq) {
            dispatch(
                getAreaListDepth2(
                    changeSearchOptionDepth2({
                        ...initialState.depth2.search,
                        parentAreaSeq: areaSeq,
                    }),
                ),
            );
            dispatch(getAreaDepth1({ areaSeq }));
        } else {
            dispatch(clearArea(1));
            dispatch(clearArea(2));
            dispatch(clearArea(3));
            dispatch(clearList(2));
            dispatch(clearList(3));
            dispatch(changeSelectedDepth(1));
        }
    }, [areaSeq, dispatch, history, match.path]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        history.push(`/area/${data.areaSeq}`);
        dispatch(changeSelectedDepth(1));
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickAdd = () => {
        dispatch(changeSelectedDepth(1));
        dispatch(clearArea(1));
        history.push('/area');
    };

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10" bodyClassName="d-flex flex-column">
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0 d-flex justify-content-end">
                        <Button variant="positive" onClick={handleClickAdd} className="ft-12">
                            추가
                        </Button>
                    </Col>
                </Form.Row>

                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    loading={loading}
                    rowData={rowData}
                    selected={areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                    preventRowClickCell={['delete']}
                    suppressRefreshCellAfterUpdate
                />
            </MokaCard>
            <Route path={[`${match.url}/:areaSeq`, match.url]} strict render={(props) => <Depth2 {...props} parentSeq={areaSeq} baseUrl="/area" onDelete={onDelete} />} />
        </React.Fragment>
    );
};

export default AreaAgGrid1D;
