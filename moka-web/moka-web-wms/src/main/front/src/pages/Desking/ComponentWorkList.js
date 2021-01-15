import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { AREA_ALIGN_H, ITEM_CT, ITEM_CP, AREA_COMP_ALIGN_LEFT, API_BASE_URL } from '@/constants';
import { GET_COMPONENT_WORK_LIST, changeWorkStatus, putComponentWorkTemplate, PUT_COMPONENT_WORK_TEMPLATE } from '@store/desking';
import { getChannelTp } from '@store/codeMgt';
import { ComponentWork, NaverChannelWork } from './components';

/**
 * 컴포넌트의 워크 리스트
 */
const ComponentWorkList = (props) => {
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_COMPONENT_WORK_LIST] || store.loading[PUT_COMPONENT_WORK_TEMPLATE]);
    const { area, isNaverChannel } = useSelector((store) => ({
        area: store.desking.area,
        isNaverChannel: store.desking.isNaverChannel,
    }));
    const { componentWorkList, workStatus } = useSelector((store) => ({
        componentWorkList: store.desking.list,
        workStatus: store.desking.workStatus,
    }));
    const channelTpRows = useSelector((store) => store.codeMgt.channelTpRows);

    // state
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
     * 네이버채널 > 템플릿변경
     */
    const handleChangeTemplate = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { value } = e.target;
        const { workseq } = e.target.dataset;
        if (workseq === '') return;

        dispatch(
            putComponentWorkTemplate({
                componentWorkSeq: Number(workseq),
                templateSeq: Number(value),
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
            } else if (isNaverChannel) {
                // 네이버채널 예외처리
                return (
                    <NaverChannelWork
                        key={`${area.areaSeq}-${componentSeq}`}
                        deskingPart={areaComp.deskingPart}
                        area={area}
                        areaSeq={area.areaSeq}
                        component={component}
                        editFormPart={editFormPart}
                        agGridIndex={targetIdx}
                        componentWorkList={componentWorkList}
                        {...props}
                    />
                );
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
        [area, componentWorkList, isNaverChannel, props, workStatus],
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

    useEffect(() => {
        // 네이버채널 => CHANNEL_TP 조회
        dispatch(getChannelTp());
    }, [dispatch]);

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
                <div className="d-flex justify-content-between p-2 border-bottom" style={{ height: 45 }}>
                    {isNaverChannel ? (
                        // 네이버채널 예외처리
                        <div style={{ width: 230 }}>
                            <MokaInputLabel
                                label="타입선택"
                                labelWidth={47}
                                as="select"
                                labelClassName="ml-0"
                                className="h-100 mb-0"
                                value={componentWorkList.length > 0 ? componentWorkList[0].templateSeq : null}
                                inputProps={{ size: 'sm', 'data-workseq': componentWorkList.length > 0 ? componentWorkList[0].seq : '' }}
                                onChange={handleChangeTemplate}
                            >
                                <option hidden>템플릿 선택</option>
                                {channelTpRows &&
                                    channelTpRows.map((code) => (
                                        <option key={code.id} value={code.id}>
                                            {code.name}
                                        </option>
                                    ))}
                            </MokaInputLabel>
                        </div>
                    ) : (
                        <React.Fragment>
                            <div style={{ width: 170 }}>
                                <MokaInput as="select" className="h-100" value={null} inputProps={{ size: 'sm' }} onChange={handleChangeDisabled}>
                                    <option hidden>비활성 영역 보기</option>
                                    {disabledList.map((work) => (
                                        <option key={work.seq} value={work.seq}>
                                            {work.componentName}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                            <Button variant="outline-neutral" className="flex-shrink-0" onClick={handleClickPreview}>
                                페이지 미리보기
                            </Button>
                        </React.Fragment>
                    )}
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
