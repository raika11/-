import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput } from '@components';
import { AREA_ALIGN_H, ITEM_CT, ITEM_CP, AREA_COMP_ALIGN_LEFT, API_BASE_URL } from '@/constants';
import { GET_COMPONENT_WORK_LIST } from '@store/desking';
import ComponentWork from './components/ComponentWork';

/**
 * 컴포넌트의 워크 리스트
 */
const ComponentWorkList = (props) => {
    const { area, componentWorkList, workStatus, loading } = useSelector((store) => ({
        area: store.desking.area,
        componentWorkList: store.desking.list,
        workStatus: store.desking.workStatus,
        loading: store.loading[GET_COMPONENT_WORK_LIST],
    }));

    const [disabledList, setDisabledList] = useState([]);
    const [leftList, setLeftList] = useState([]);
    const [rightList, setRightList] = useState([]);

    const handleClickPreview = () => {
        if (area.page.pageSeq) {
            window.open(`${API_BASE_URL}/preview/desking/page?pageSeq=${area.page.pageSeq}`, '페이지미리보기');
        }
    };

    useEffect(() => {
        // 왼쪽, 오른쪽 리스트
        if (area.areaDiv === ITEM_CP) {
            setRightList([]);
            area.areaComp ? setLeftList([area.areaComp]) : setLeftList(area.areaComps);
        } else if (area.areaDiv === ITEM_CT) {
            let left = [],
                right = [];

            area.areaAlign === AREA_ALIGN_H
                ? area.areaComps.forEach((comp) => {
                      comp.compAlign === AREA_COMP_ALIGN_LEFT ? left.push(comp) : right.push(comp);
                  })
                : left.concat(area.areaComps);

            setLeftList(left);
            setRightList(right);
        }
    }, [area.areaAlign, area.areaComp, area.areaComps, area.areaDiv]);

    useEffect(() => {
        // 비활성 영역 리스트
        setDisabledList(componentWorkList.filter((work) => ((workStatus[work.seq] === 'save' || !workStatus[work.seq]) && work.viewYn === 'N' ? true : false)));
    }, [componentWorkList, workStatus]);

    return (
        <React.Fragment>
            {/* 왼쪽 기본 카드 1건 */}
            <MokaCard
                loading={loading}
                header={false}
                width={363}
                className={clsx('p-0', { 'mr-gutter': area.areaAlign !== AREA_ALIGN_H, 'mr-1': area.areaAlign === AREA_ALIGN_H })}
                bodyClassName="p-0 overflow-hidden"
            >
                <div className="d-flex justify-content-between p-2 border-bottom">
                    <div style={{ width: 170 }}>
                        <MokaInput as="select" className="ft-12" value={null} onChange={() => {}}>
                            <option hidden>비활성 영역 보기</option>
                            {disabledList.map((work) => (
                                <option key={work.seq}>{work.componentName}</option>
                            ))}
                        </MokaInput>
                    </div>
                    <Button variant="outline-neutral" className="ft-12 flex-shrink-0" onClick={handleClickPreview}>
                        페이지 미리보기
                    </Button>
                </div>

                <div className="custom-scroll overflow-y-scroll" style={{ height: 'calc(100% - 45px)' }}>
                    {leftList.map((areaComp) => {
                        const targetIdx = componentWorkList.findIndex((comp) => comp.componentSeq === areaComp.component.componentSeq);
                        const component = componentWorkList[targetIdx];

                        if (!component) {
                            return null;
                        } else if ((workStatus[component.seq] === 'save' || !workStatus[component.seq]) && component.viewYn === 'N') {
                            return null;
                        } else {
                            return <ComponentWork key={`${area.areaSeq}-${areaComp.component.componentSeq}`} component={component} agGridIndex={targetIdx} {...props} />;
                        }
                    })}
                </div>
            </MokaCard>

            {rightList.length > 0 && (
                <MokaCard loading={loading} header={false} width={363} className="p-0 mr-gutter" bodyClassName="p-0 overflow-hidden">
                    <div className="d-flex justify-content-end p-2 border-bottom" style={{ height: 45 }}></div>

                    <div className="custom-scroll overflow-y-scroll" style={{ height: 'calc(100% - 45px)' }}>
                        {rightList.map((areaComp) => {
                            const targetIdx = componentWorkList.findIndex((comp) => comp.componentSeq === areaComp.component.componentSeq);
                            const component = componentWorkList[targetIdx];

                            if (!component) {
                                return null;
                            } else if ((workStatus[component.seq] === 'save' || !workStatus[component.seq]) && component.viewYn === 'N') {
                                return null;
                            } else {
                                return <ComponentWork key={`${area.areaSeq}-${areaComp.component.componentSeq}`} component={component} agGridIndex={targetIdx} {...props} />;
                            }
                        })}
                    </div>
                </MokaCard>
            )}
        </React.Fragment>
    );
};

export default ComponentWorkList;
