import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { MokaCard } from '@/components';
import RunState from './RunState/index';
import Work from './Work/index';
import DeleteWork from './DeleteWork/index';
import DeployServer from './DeployServer/index';
import { getGenCate } from '@/store/codeMgt';

/**
 * 시스템 모니터링 > 스케줄 서버 관리
 */
const Schedule = ({ match }) => {
    const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState(0);

    const tabs = [<RunState match={match} />, <Work match={match} />, <DeleteWork match={match} />, <DeployServer match={match} />];
    const tabNavs = ['작업 실행상태', '작업 목록', '삭제 작업 목록', '배포 서버 관리', '백오피스 예약작업'];

    /**
     * Nav 선택 콜백
     * @param {any} eventKey 이벤트키
     */
    const handleSelect = useCallback((eventKey, e) => {
        setActiveKey(eventKey);
        if (e) {
            e.currentTarget.blur();
        }
    }, []);

    // useEffect(() => {
    //     // 탭의 activeKey를 직접 제어
    //     if (parentKey !== null && parentKey !== undefined) {
    //         handleSelect(String(parentKey));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [parentKey]);

    useEffect(() => {
        // 기타코드 스케줄 작업 목록
        dispatch(getGenCate());
    }, [dispatch]);

    return (
        <>
            <Helmet>
                <title>스케줄 서버 관리</title>
                <meta name="description" content="스케줄 서버 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard className="w-100 h-100" title="스케줄 서버 관리">
                {/* <MokaCardTabs
                    className="w-100 h-100"
                    style={{ boxShadow: 'none' }}
                    navWidth={120}
                    tabs={[<RunState match={match} />, <Work match={match} />, <DeleteWork match={match} />, <DeployServer match={match} />]}
                    tabNavs={['작업 실행상태', '작업 목록', '삭제 작업 목록', '배포 서버 관리']}
                /> */}

                <div className="tab card-tab w-100 h-100" style={{ boxShadow: 'none' }}>
                    <Tab.Container activeKey={activeKey}>
                        <div className="d-flex">
                            <Nav activeKey={activeKey} variant="tabs" className="flex-row" onSelect={handleSelect}>
                                {tabNavs.map((nav, idx) => (
                                    <Nav.Item key={idx} style={{ width: 120 }}>
                                        <Nav.Link eventKey={idx} className="h4">
                                            {nav}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </div>
                        <div className="d-flex custom-scroll">
                            <Tab.Content className="p-0">
                                {tabs.map((tab, idx) => (
                                    <Tab.Pane key={idx} eventKey={idx} className="overflow-hidden h-100">
                                        <div className="pb-3 pt-20 h-100 custom-scroll">{tab}</div>
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </MokaCard>
        </>
    );
};

export default Schedule;
