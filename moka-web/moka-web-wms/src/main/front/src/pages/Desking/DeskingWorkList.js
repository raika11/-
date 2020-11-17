import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaInputLabel } from '@components';
import { AREA_ALIGN_H, AREA_COMP_ALIGN_LEFT, AREA_COMP_ALIGN_RIGHT } from '@/constants';
import { GET_COMPONENT_WORK_LIST } from '@store/desking';
import DeskingWorkComponent from './components/DeskingWorkComponent';

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

    const mrGutter = {
        'mr-gutter': area.areaAlign === AREA_ALIGN_H ? false : true,
    };

    return (
        <div className="d-flex">
            <div className={clsx('p-2', mrGutter, 'border', 'd-flex', 'flex-column')} style={{ backgroundColor: 'white' }}>
                <Container fluid className="mb-2">
                    <Row className="d-flex justify-content-between">
                        <Col xs={5} className="p-0">
                            <MokaInputLabel
                                label="기사 갯수"
                                labelClassName="d-flex justify-content-start"
                                className="mb-0"
                                inputClassName="ft-12"
                                name="perPageCount"
                                // value={}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Button variant="dark" className="ft-12" onClick={handlePreviewClicked}>
                            페이지 미리보기
                        </Button>
                    </Row>
                </Container>
                <div>
                    {!loading &&
                        area.areaComps.map((areaComp) => {
                            if (areaComp.compAlign !== AREA_COMP_ALIGN_LEFT) return null;
                            const targetIndex = list.findIndex((comp) => comp.componentSeq === areaComp.component.componentSeq);
                            return (
                                <DeskingWorkComponent
                                    key={`${area.areaSeq}-${areaComp.component.seq}`}
                                    component={list[targetIndex]}
                                    agGridIndex={targetIndex}
                                    // onRowClicked={handleRowClicked}
                                    {...props}
                                />
                            );
                        })}
                </div>
            </div>

            {area.areaAlign === AREA_ALIGN_H && (
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
                                    // value={}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Button variant="dark" className="ft-12" onClick={handlePreviewClicked}>
                                페이지 미리보기
                            </Button>
                        </Row>
                    </Container>
                    <div>
                        {!loading &&
                            area.areaComps.map((areaComp) => {
                                if (areaComp.compAlign !== AREA_COMP_ALIGN_RIGHT) return null;
                                const targetIndex = list.findIndex((comp) => comp.componentSeq === areaComp.component.componentSeq);
                                return (
                                    <DeskingWorkComponent
                                        key={`${area.areaSeq}-${areaComp.component.seq}`}
                                        component={list[targetIndex]}
                                        agGridIndex={targetIndex}
                                        // onRowClicked={handleRowClicked}
                                        {...props}
                                    />
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeskingWorkList;
