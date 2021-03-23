import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { AREA_ALIGN_H, ITEM_CT, ITEM_CP, AREA_COMP_ALIGN_LEFT, API_BASE_URL } from '@/constants';
import { GET_COMPONENT_WORK_LIST, changeWorkStatus, putComponentWorkTemplate, PUT_COMPONENT_WORK_TEMPLATE } from '@store/desking';
import { getChannelTp } from '@store/codeMgt';
import { ComponentWork, NaverChannelWork, NaverStandWork } from './components';

/**
 * 컴포넌트의 워크 리스트
 */
const ComponentWorkList = (props) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_COMPONENT_WORK_LIST] || loading[PUT_COMPONENT_WORK_TEMPLATE]);
    const { area, isNaverChannel, isNaverStand } = useSelector(({ desking }) => desking);
    const { list: componentWorkList, workStatus } = useSelector(({ desking }) => desking);
    const channelTpRows = useSelector(({ codeMgt }) => codeMgt.channelTpRows);
    const saveFailMsg = '편집된 정보가 있습니다. 임시저장 버튼을 클릭후\n전송 버튼을 클릭하여 주세요.';

    // state
    const [disabledList, setDisabledList] = useState([]); // 비활성영역 리스트
    const [leftList, setLeftList] = useState([]); // 왼쪽 워크리스트
    const [rightList, setRightList] = useState([]); // 오른쪽 워크리스트

    /**
     * 페이지 미리보기
     */
    const handleClickPreview = useCallback(() => {
        if (area.page?.pageSeq) {
            window.open(`${API_BASE_URL}/preview/desking/page?pageSeq=${area.page.pageSeq}&areaSeq=${area.areaSeq}`, '페이지미리보기');
        }
    }, [area]);

    /**
     * 비활성 영역의 셀렉트 option => 컴포넌트워크 값은 변동 X, status만 work로 변경한다!
     */
    const handleChangeDisabled = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            dispatch(
                changeWorkStatus({
                    componentWorkSeq: Number(e.target.value),
                    status: 'work',
                }),
            );
        },
        [dispatch],
    );

    /**
     * 네이버채널 > 템플릿변경
     */
    const handleChangeTemplate = useCallback(
        (e) => {
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
        },
        [dispatch],
    );

    /**
     * 컴포넌트 워크의 타이틀 생성
     */
    const renderTitle = useCallback(() => {
        if (isNaverChannel) {
            // 네이버채널 예외처리
            return (
                <div style={{ width: 230 }}>
                    <MokaInputLabel
                        label="타입선택"
                        labelWidth={50}
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
            );
        } else if (isNaverStand) {
            // 네이버스탠드 예외처리
            return null;
        } else {
            return (
                <React.Fragment>
                    <div style={{ width: 170 }}>
                        <MokaInput as="select" className="h-100" value={null} inputProps={{ size: 'sm' }} onChange={handleChangeDisabled}>
                            <option value="" disabled>
                                비활성 영역 보기
                            </option>
                            {disabledList.map((work) => (
                                <option key={work.seq} value={work.seq}>
                                    {work.componentName}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    <Button variant="outline-neutral" size="sm" className="flex-shrink-0" onClick={handleClickPreview}>
                        페이지 미리보기
                    </Button>
                </React.Fragment>
            );
        }
    }, [channelTpRows, componentWorkList, disabledList, handleChangeDisabled, handleChangeTemplate, handleClickPreview, isNaverChannel, isNaverStand]);

    /**
     * 컴포넌트 워크 render
     */
    const renderList = useCallback(
        (areaComp) => {
            const { componentSeq, editFormPart } = areaComp.component;
            const targetIdx = componentWorkList.findIndex((comp) => comp.componentSeq === componentSeq);
            const component = componentWorkList[targetIdx];
            const key = `${area.areaSeq}-${componentSeq}`;

            if (!component) {
                return null;
            } else if (workStatus[component.seq] !== 'work' && component.viewYn === 'N') {
                return null;
            } else if (isNaverChannel) {
                // 네이버채널 예외처리
                return (
                    <NaverChannelWork
                        key={key}
                        deskingPart={areaComp.deskingPart}
                        area={area}
                        areaSeq={area.areaSeq}
                        component={component}
                        editFormPart={editFormPart}
                        agGridIndex={targetIdx}
                        componentWorkList={componentWorkList}
                        saveFailMsg={saveFailMsg}
                        {...props}
                    />
                );
            } else if (isNaverStand) {
                // 네이버스탠드 예외처리
                return (
                    <NaverStandWork
                        key={key}
                        deskingPart={areaComp.deskingPart}
                        area={area}
                        areaSeq={area.areaSeq}
                        component={component}
                        agGridIndex={targetIdx}
                        saveFailMsg={saveFailMsg}
                        {...props}
                    />
                );
            } else {
                return (
                    <ComponentWork
                        key={key}
                        deskingPart={areaComp.deskingPart}
                        area={area}
                        areaSeq={area.areaSeq}
                        component={component}
                        editFormPart={editFormPart}
                        agGridIndex={targetIdx}
                        saveFailMsg={saveFailMsg}
                        {...props}
                    />
                );
            }
        },
        [area, componentWorkList, isNaverChannel, isNaverStand, props, workStatus],
    );

    useEffect(() => {
        if (area.areaDiv === ITEM_CP) {
            // CP => 왼쪽 리스트만 노출
            setRightList([]);
            area.areaComp ? setLeftList([area.areaComp]) : setLeftList(area.areaComps);
        } else if (area.areaDiv === ITEM_CT) {
            // CT => 편집영역의 설정에 따라 왼쪽, 오른쪽 리스트 노출
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
                className={clsx('p-0 position-relative h-100', { 'mr-gutter': area.areaAlign !== AREA_ALIGN_H, 'mr-1': area.areaAlign === AREA_ALIGN_H })}
                bodyClassName="p-0 mt-0 overflow-hidden"
            >
                <div className="d-flex justify-content-between p-2 border-bottom" style={{ height: 45 }}>
                    {renderTitle()}
                </div>

                <div className="custom-scroll scrollable overflow-x-hidden" style={{ height: 'calc(100% - 45px)' }}>
                    {leftList.map((areaComp) => renderList(areaComp))}
                </div>
            </MokaCard>

            {/* 오른쪽 카드 */}
            {rightList.length > 0 && (
                <MokaCard loading={loading} header={false} width={363} className="p-0 position-relative mr-gutter h-100" bodyClassName="p-0 mt-0 overflow-hidden">
                    <div className="d-flex justify-content-end p-2 border-bottom" style={{ height: 45 }}></div>

                    <div className="custom-scroll scrollable overflow-x-hidden" style={{ height: 'calc(100% - 45px)' }}>
                        {rightList.map((areaComp) => renderList(areaComp))}
                    </div>
                </MokaCard>
            )}
        </React.Fragment>
    );
};

export default ComponentWorkList;
