import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInput, MokaTable } from '@components';
import { changeLatestDomainId } from '@store/auth';
import {
    initialState,
    getAreaListDepth1,
    getAreaListDepth2,
    clearArea,
    changeSearchOptionDepth1,
    changeSearchOptionDepth2,
    changeSelectedDepth,
    getAreaDepth1,
    GET_AREA_LIST_DEPTH1,
} from '@store/area';
import Depth2 from './AreaAgGridDepth2';
import columnDefs from './AreaAgGridColums';

/**
 * 편집영역 > 첫번째 리스트
 */
const AreaAgGrid1D = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { areaSeq } = useParams();
    const { domainList, latestDomainId, search: storeSearch, list, loading } = useSelector((store) => ({
        domainList: store.auth.domainList,
        latestDomainId: store.auth.latestDomainId,
        search: store.area.depth1.search,
        list: store.area.depth1.list,
        loading: store.loading[GET_AREA_LIST_DEPTH1],
    }));

    // state
    const [search, setSearch] = useState(initialState.depth1.search);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // latestDomainId 변경 => search.domainId 변경하여 1뎁스 리스트 조회
        if (latestDomainId && latestDomainId !== search.domainId) {
            dispatch(
                getAreaListDepth1(
                    changeSearchOptionDepth1({
                        ...search,
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    useEffect(() => {
        // areaSeq가 있으면 2뎁스 리스트 조회 + 상세 데이터 조회
        if (areaSeq) {
            dispatch(
                getAreaListDepth2(
                    changeSearchOptionDepth2({
                        ...initialState.depth2.search,
                        domainId: latestDomainId,
                        parentAreaSeq: areaSeq,
                    }),
                ),
            );
            dispatch(getAreaDepth1({ areaSeq }));
        } else {
            dispatch(clearArea(1));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaSeq, latestDomainId]);

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
        history.push('/area');
    };

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10">
                <Form.Row className="mb-2">
                    <Col xs={7} className="p-0">
                        <MokaInput
                            as="select"
                            value={search.domainId}
                            onChange={(e) => {
                                dispatch(changeLatestDomainId(e.target.value));
                                history.push('/area');
                            }}
                        >
                            {domainList.map((domain) => (
                                <option key={domain.domainId} value={domain.domainId}>
                                    {domain.domainName}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={5} className="p-0 d-flex justify-content-end">
                        <Button variant="dark" onClick={handleClickAdd}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>

                <MokaTable
                    agGridHeight={738}
                    columnDefs={columnDefs}
                    loading={loading}
                    rowData={list}
                    selected={areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                />
            </MokaCard>
            <Route path={[`${match.url}/:areaSeq`, match.url]} strict render={(props) => <Depth2 {...props} parentSeq={areaSeq} baseUrl={`/area/${areaSeq}`} />} />
        </React.Fragment>
    );
};

export default AreaAgGrid1D;
