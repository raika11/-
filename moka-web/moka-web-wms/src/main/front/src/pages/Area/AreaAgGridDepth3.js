import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable } from '@components';
import toast from '@utils/toastUtil';
import { changeSelectedDepth, clearArea, getAreaDepth3, GET_AREA_LIST_DEPTH3 } from '@store/area';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 세번째 리스트
 */
const AreaAgGridDepth3 = ({ baseUrl, onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { areaSeq } = useParams();
    const { list, loading, areaDepth1, areaDepth2 } = useSelector((store) => ({
        list: store.area.depth3.list,
        loading: store.loading[GET_AREA_LIST_DEPTH3],
        areaDepth1: store.area.depth1.area,
        areaDepth2: store.area.depth2.area,
    }));

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

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        history.push(`${baseUrl}/${areaDepth1.areaSeq}/${areaDepth2.areaSeq}/${data.areaSeq}`);
        dispatch(changeSelectedDepth(3));
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickAdd = () => {
        if (areaDepth1.areaSeq) {
            dispatch(changeSelectedDepth(3));
            dispatch(clearArea(3));
            if (areaDepth2.areaSeq) {
                history.push(`${baseUrl}/${areaDepth1.areaSeq}/${areaDepth2.areaSeq}`);
            } else {
                history.push(`${baseUrl}/${areaDepth1.areaSeq}`);
            }
        } else {
            toast.warning('상위 편집영역을 선택해주세요');
        }
    };

    useEffect(() => {
        // areaSeq가 있으면 상세데이터 조회
        if (areaSeq) {
            dispatch(getAreaDepth3({ areaSeq }));
            dispatch(changeSelectedDepth(3));
        }
    }, [areaSeq, dispatch]);

    return (
        <MokaCard header={false} width={280} className="mr-gutter">
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0 d-flex justify-content-end">
                    <Button variant="positive" onClick={handleClickAdd}>
                        추가
                    </Button>
                </Col>
            </Form.Row>

            <MokaTable
                agGridHeight={738}
                selected={areaSeq}
                rowData={rowData}
                columnDefs={columnDefs}
                header={false}
                paging={false}
                dragging={false}
                onRowNodeId={(data) => data.areaSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                preventRowClickCell={['delete']}
            />
        </MokaCard>
    );
};

export default AreaAgGridDepth3;
