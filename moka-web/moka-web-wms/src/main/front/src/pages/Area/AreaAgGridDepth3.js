import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable } from '@components';
import toast from '@utils/toastUtil';
import { changeSelectedDepth, getAreaDepth3, clearArea, GET_AREA_LIST_DEPTH3 } from '@store/area';
import columnDefs from './AreaAgGridColums';

/**
 * 편집영역 > 세번째 리스트
 */
const AreaAgGridDepth3 = ({ parentSeq, baseUrl }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { areaSeq, loading } = useParams();
    const { list } = useSelector((store) => ({
        list: store.area.depth3.list,
        loading: store.loading[GET_AREA_LIST_DEPTH3],
    }));

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        history.push(`${baseUrl}/${data.areaSeq}`);
        dispatch(changeSelectedDepth(3));
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickAdd = () => {
        if (parentSeq) {
            dispatch(changeSelectedDepth(3));
            history.push(baseUrl);
        } else {
            toast.warn('상위 편집영역을 선택해주세요');
        }
    };

    useEffect(() => {
        // areaSeq가 있으면 상세데이터 조회
        if (areaSeq) {
            dispatch(getAreaDepth3({ areaSeq }));
            dispatch(changeSelectedDepth(3));
        } else {
            dispatch(clearArea(3));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaSeq]);

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
                columnDefs={columnDefs}
                header={false}
                paging={false}
                dragging={false}
                onRowNodeId={(data) => data.areaSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
            />
        </MokaCard>
    );
};

export default AreaAgGridDepth3;
