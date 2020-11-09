import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable } from '@components';
import { initialState, changeSelectedDepth, getAreaDepth2, clearArea, getAreaListDepth3, changeSearchOptionDepth3, GET_AREA_LIST_DEPTH2 } from '@store/area';
import Depth3 from './AreaAgGridDepth3';
import columnDefs from './AreaAgGridColums';

/**
 * 편집영역 > 두번째 리스트
 */
const AreaAgGridDepth2 = ({ match, parentSeq, baseUrl }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { areaSeq } = useParams();
    const { list, latestDomainId, loading } = useSelector((store) => ({
        list: store.area.depth2.list,
        latestDomainId: store.auth.latestDomainId,
        loading: store.loading[GET_AREA_LIST_DEPTH2],
    }));

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        history.push(`${baseUrl}/${data.areaSeq}`);
        dispatch(changeSelectedDepth(2));
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickAdd = () => {
        dispatch(changeSelectedDepth(2));
        if (parentSeq) {
            history.push(baseUrl);
        } else {
            history.push('/area');
        }
    };

    useEffect(() => {
        // areaSeq가 있으면 3뎁스 리스트 조회
        if (areaSeq) {
            dispatch(
                getAreaListDepth3(
                    changeSearchOptionDepth3({
                        ...initialState.depth3.search,
                        domainId: latestDomainId,
                        parentAreaSeq: areaSeq,
                    }),
                ),
            );
            dispatch(getAreaDepth2({ areaSeq }));
            dispatch(changeSelectedDepth(2));
        } else {
            dispatch(clearArea(2));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaSeq, latestDomainId]);

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10">
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0 d-flex justify-content-end">
                        <Button variant="dark" onClick={handleClickAdd}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>

                <MokaTable
                    agGridHeight={738}
                    rowData={list}
                    columnDefs={columnDefs}
                    selected={areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                />
            </MokaCard>

            <Route path={[`${match.url}/:areaSeq`, match.url]} strict render={(props) => <Depth3 {...props} parentSeq={areaSeq} baseUrl={`${baseUrl}/${areaSeq}`} />} />
        </React.Fragment>
    );
};

export default AreaAgGridDepth2;
