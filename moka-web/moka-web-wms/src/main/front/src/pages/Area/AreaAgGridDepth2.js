import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable } from '@components';
import { initialState, changeArea, getAreaListDepth3, changeSearchOptionDepth3 } from '@store/area';
import Depth3 from './AreaAgGridDepth3';

/**
 * 편집영역 > 두번째 리스트
 */
const AreaAgGridDepth2 = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { areaSeq } = useParams();
    const { list, latestDomainId } = useSelector((store) => ({
        list: store.area.depth2.list,
        latestDomainId: store.authlatestDomainId,
    }));

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
                depth: 2,
            }),
        );
        history.push('/area');
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
                    selected={areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                />
            </MokaCard>

            <Route path={[`${match.url}/:areaSeq`, match.url]} strict component={Depth3} />
        </React.Fragment>
    );
};

export default AreaAgGridDepth2;
