import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable } from '@components';
import { initialState, changeArea } from '@store/area';

/**
 * 편집영역 > 세번째 리스트
 */
const AreaAgGridDepth3 = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { areaSeq } = useParams();
    const { list } = useSelector((store) => ({
        list: store.area.depth3.list,
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
                depth: 3,
            }),
        );
    };

    return (
        <MokaCard header={false} width={280} className="mr-gutter">
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0 d-flex justify-content-end">
                    <Button variant="dark" onClick={handleClickAdd}>
                        추가
                    </Button>
                </Col>
            </Form.Row>

            <MokaTable
                agGridHeight={738}
                selected={areaSeq}
                rowData={list}
                header={false}
                paging={false}
                dragging={false}
                onRowNodeId={(data) => data.areaSeq}
                onRowClicked={handleRowClicked}
            />
        </MokaCard>
    );
};

export default AreaAgGridDepth3;
