import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInput, MokaTable } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { initialState, getAreaListDepth1, changeSearchOptionDepth1 } from '@store/area';

import Depth2 from './AreaAgGridDepth2';

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
        // latestDomainId 변경 => search.domainId 변경
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

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        history.push(`${match.url}/${data.areaSeq}`);
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
                        <Button variant="dark">추가</Button>
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
