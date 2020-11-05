import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInput, MokaTable } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { initialState, getAreaListDepth1, getAreaListDepth2, changeSearchOptionDepth1, changeSearchOptionDepth2, changeArea } from '@store/area';
import Depth2 from './AreaAgGridDepth2';

/**
 * 편집영역 > 첫번째 리스트
 */
const AreaAgGrid1D = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { areaSeq } = useParams();
    const { domainList, latestDomainId, search: storeSearch, list } = useSelector((store) => ({
        domainList: store.auth.domainList,
        latestDomainId: store.auth.latestDomainId,
        search: store.area.depth1.search,
        list: store.area.depth1.list,
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
                        page: 0,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    useEffect(() => {
        // areaSeq가 있으면 2뎁스 리스트 조회
        if (areaSeq) {
            dispatch(
                getAreaListDepth2(
                    changeSearchOptionDepth2({
                        ...initialState.depth2.search,
                        domainId: latestDomainId,
                        depth: 2,
                        areaSeq: areaSeq,
                        page: 0,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaSeq, latestDomainId]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        history.push(`${match.url}/${data.areaSeq}`);
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickAdd = () => {
        dispatch(
            changeArea({
                ...initialState.area,
                depth: 1,
            }),
        );
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
                    rowData={list}
                    selected={areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                />
            </MokaCard>
            <Route path={[`${match.url}/:areaSeq`, match.url]} strict component={Depth2} />
        </React.Fragment>
    );
};

export default AreaAgGrid1D;
