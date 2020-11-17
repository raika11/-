import React from 'react';
import { useSelector } from 'react-redux';
import produce from 'immer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaInputLabel, MokaLoader } from '@components';
import { ITEM_CP, ITEM_CT, AREA_ALIGN_V, AREA_ALIGN_H } from '@/constants';
import { GET_COMPONENT_WORK_LIST } from '@store/desking';
import DeskingWorkComponent from './components/DeskingWorkComponent';

const component = {
    componentSeq: 1,
    componentName: '좌측',
    perPageCount: 10,
};

/**
 * 데스킹 편집화면
 */
const DeskingWorkList = (props) => {
    const { area, list, loading } = useSelector((store) => ({
        area: store.desking.area,
        list: store.desking.list,
        loading: store.loading[GET_COMPONENT_WORK_LIST],
    }));

    const handlePreviewClicked = () => {
        // window.open(
        //     `${API_BASE_URL}/preview/desking/page?pageSeq=${pageSeq}&editionSeq=0`,
        //     '전체미리보기'
        // );
    };

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
    };

    return (
        <div className="p-2 mr-gutter border d-flex flex-column" style={{ backgroundColor: 'white' }}>
            <Container fluid className="mb-2">
                <Row className="d-flex justify-content-between">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="기사 갯수"
                            labelClassName="d-flex justify-content-start"
                            className="mb-0"
                            inputClassName="ft-12"
                            name="perPageCount"
                            value={component.perPageCount}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Button variant="dark" className="ft-12" onClick={handlePreviewClicked}>
                        페이지 미리보기
                    </Button>
                </Row>
            </Container>
            <div>
                {/* 로딩 */}
                {/* {loading && <MokaLoader />} */}
                {/* 데스킹 컴포넌트 */}
                {!loading &&
                    list &&
                    list.map((component, index) => {
                        return (
                            <DeskingWorkComponent
                                key={`${area.areaSeq}-${component.seq}`}
                                component={component}
                                agGridIndex={index}
                                {...props}
                                // onRowClicked={handleRowClicked}
                            />
                        );
                    })}
                {/* {area.areaAlign === AREA_ALIGN_H && (
                    <div className="d-flex">
                        <DeskingWorkComponent key={`1-1`} component={component} agGridIndex="1" />
                        <DeskingWorkComponent key={`1-1`} component={component} agGridIndex="1" />
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default DeskingWorkList;
