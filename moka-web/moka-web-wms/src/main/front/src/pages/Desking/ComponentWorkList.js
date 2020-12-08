import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput } from '@components';
import { AREA_ALIGN_H, ITEM_CT, ITEM_CP, AREA_COMP_ALIGN_LEFT, API_BASE_URL } from '@/constants';
import { GET_COMPONENT_WORK_LIST, changeWorkStatus } from '@store/desking';
import { ComponentWork } from './components';

/**
 * 컴포넌트의 워크 리스트
 */
const ComponentWorkList = (props) => {
    const dispatch = useDispatch();
    const { area, componentWorkList, workStatus, loading } = useSelector((store) => ({
        area: store.desking.area,
        componentWorkList: store.desking.list,
        workStatus: store.desking.workStatus,
        loading: store.loading[GET_COMPONENT_WORK_LIST],
    }));

    const [disabledList, setDisabledList] = useState([]);
    const [leftList, setLeftList] = useState([]);
    const [rightList, setRightList] = useState([]);

    /**
     * 페이지 미리보기
     */
    const handleClickPreview = () => {
        if (area.page.pageSeq) {
            window.open(`${API_BASE_URL}/preview/desking/page?pageSeq=${area.page.pageSeq}`, '페이지미리보기');
        }
    };

    /**
     * 비활성 영역의 셀렉트 option => 컴포넌트워크 값은 변동 X, status만 work로 변경한다!
     */
    const handleChangeDisabled = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(
            changeWorkStatus({
                componentWorkSeq: Number(e.target.value),
                status: 'work',
            }),
        );
    };

    /**
     * 컴포넌트 워크 render
     */
    const render = React.useCallback(
        (areaComp) => {
            const { componentSeq, editFormPart } = areaComp.component;
            const targetIdx = componentWorkList.findIndex((comp) => comp.componentSeq === componentSeq);
            const component = componentWorkList[targetIdx];

            if (!component) {
                return null;
            } else if (workStatus[component.seq] !== 'work' && component.viewYn === 'N') {
                return null;
            } else {
                return (
                    <ComponentWork
                        key={`${area.areaSeq}-${componentSeq}`}
                        deskingPart={areaComp.deskingPart}
                        area={area}
                        areaSeq={area.areaSeq}
                        component={component}
                        editFormPart={editFormPart}
                        agGridIndex={targetIdx}
                        {...props}
                    />
                );
            }
        },
        [area, componentWorkList, props, workStatus],
    );

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
                : (left = left.concat(area.areaComps));

            setLeftList(left);
            setRightList(right);
        }
    }, [area.areaAlign, area.areaComp, area.areaComps, area.areaDiv]);

    useEffect(() => {
        // 비활성 영역 리스트 (work 상태가 아니고 N인 것만 리스트에 포함)
        setDisabledList(componentWorkList.filter((work) => (workStatus[work.seq] !== 'work' && work.viewYn === 'N' ? true : false)));
    }, [componentWorkList, workStatus]);

    return (
        <React.Fragment>
            {/* 왼쪽 기본 카드 1건 */}
            <MokaCard
                loading={loading}
                header={false}
                width={363}
                className={clsx('p-0 position-relative', { 'mr-gutter': area.areaAlign !== AREA_ALIGN_H, 'mr-1': area.areaAlign === AREA_ALIGN_H })}
                bodyClassName="p-0 overflow-hidden"
            >
                <div className="d-flex justify-content-between p-2 border-bottom">
                    <div style={{ width: 170 }}>
                        <MokaInput as="select" className="ft-12 h-100" value={null} inputProps={{ size: 'sm' }} onChange={handleChangeDisabled}>
                            <option hidden>비활성 영역 보기</option>
                            {disabledList.map((work) => (
                                <option key={work.seq} value={work.seq}>
                                    {work.componentName}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    <Button variant="outline-neutral" className="ft-12 flex-shrink-0" onClick={handleClickPreview}>
                        페이지 미리보기
                    </Button>
                </div>

                <div className="custom-scroll" style={{ height: 'calc(100% - 45px)' }}>
                    {leftList.map((areaComp) => render(areaComp))}
                </div>
            </MokaCard>

            {/* 오른쪽 카드 */}
            {rightList.length > 0 && (
                <MokaCard loading={loading} header={false} width={363} className="p-0 position-relative mr-gutter" bodyClassName="p-0 overflow-hidden">
                    <div className="d-flex justify-content-end p-2 border-bottom" style={{ height: 45 }}></div>

                    <div className="custom-scroll" style={{ height: 'calc(100% - 45px)' }}>
                        {rightList.map((areaComp) => render(areaComp))}
                    </div>
                </MokaCard>
            )}
        </React.Fragment>
    );
};

export default ComponentWorkList;
