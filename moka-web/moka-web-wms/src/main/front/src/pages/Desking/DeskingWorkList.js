import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';

import { MokaCard } from '@components';
import { AREA_ALIGN_H, AREA_ALIGN_V, AREA_COMP_ALIGN_LEFT, AREA_COMP_ALIGN_RIGHT } from '@/constants';
import { GET_COMPONENT_WORK_LIST } from '@store/desking';
import { DeskingWorkComponent } from './components';

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

    React.useEffect(() => {
        console.log(area);
    }, [area]);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
    };

    return (
        <React.Fragment>
            {/* 왼쪽 기본 카드 1건 */}
            <MokaCard loading={loading} header={false} width={363} className={clsx('p-0', { 'mr-gutter': area.areaAlign !== AREA_ALIGN_H })} bodyClassName="p-0">
                <div className="d-flex justify-content-end p-2 border-bottom">
                    {/* <Col xs={5} className="p-0">
                            <MokaInputLabel
                                label="기사 갯수"
                                labelClassName="d-flex justify-content-start"
                                className="mb-0"
                                inputClassName="ft-12"
                                name="perPageCount"
                                // value={}
                                onChange={handleChangeValue}
                            />
                        </Col> */}
                    <Button variant="outline-neutral" className="ft-12" onClick={handlePreviewClicked}>
                        페이지 미리보기
                    </Button>
                </div>

                <div>
                    {area.areaComps.map((areaComp) => {
                        if (area.areaDiv === AREA_ALIGN_H && areaComp.compAlign !== AREA_COMP_ALIGN_LEFT) return null;
                        const targetIndex = list.findIndex((comp) => comp.componentSeq === areaComp.component.componentSeq);

                        return (
                            <DeskingWorkComponent
                                key={`${area.areaSeq}-${areaComp.component.componentSeq}`}
                                component={list[targetIndex]}
                                agGridIndex={targetIndex}
                                // onRowClicked={handleRowClicked}
                                {...props}
                            />
                        );
                    })}
                </div>
            </MokaCard>

            {area.areaAlign === AREA_ALIGN_H && (
                <MokaCard loading={loading} header={false} width={363} className="p-0 mr-gutter" bodyClassName="p-0">
                    <div className="d-flex justify-content-end p-2 border-bottom">
                        <Button variant="outline-neutral" className="ft-12" onClick={handlePreviewClicked}>
                            페이지 미리보기
                        </Button>
                    </div>

                    <div>
                        {area.areaComps.map((areaComp) => {
                            if (areaComp.compAlign !== AREA_COMP_ALIGN_RIGHT) return null;
                            const targetIndex = list.findIndex((comp) => comp.componentSeq === areaComp.component.componentSeq);

                            return (
                                <DeskingWorkComponent
                                    key={`${area.areaSeq}-${areaComp.component.componentSeq}`}
                                    component={list[targetIndex]}
                                    agGridIndex={targetIndex}
                                    // onRowClicked={handleRowClicked}
                                    {...props}
                                />
                            );
                        })}
                    </div>
                </MokaCard>
            )}
        </React.Fragment>
    );
};

export default DeskingWorkList;
