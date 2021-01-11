import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { MokaCard } from '@/components';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import TourListApplyList from './TourListApplyList';
import TourListEdit from './TourListEdit';

/**
 * 견학 신청목록
 */
const TourList = ({ match }) => {
    /**
     * 메일 미리보기 버튼
     */
    const handleClickPreview = () => {
        window.open(``, '메일 미리보기');
    };

    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>신청목록</title>
                    <meta name="description" content="견학 신청목록 페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 신청 목록 */}
                <MokaCard width={948} titleClassName="mb-0" className="mr-gutter" title="신청 목록">
                    <TourListApplyList />
                </MokaCard>

                {/* 견학 신청서 */}
                <Switch>
                    <Route
                        path={[`${match.url}/:seqNo`]}
                        exact
                        render={() => (
                            <MokaCard
                                width={632}
                                titleClassName="mb-0"
                                title="견학 신청서"
                                footer
                                footerAs={
                                    <>
                                        <Col className="p-0"></Col>
                                        <Col className="p-0 d-flex justify-content-center">
                                            <Button className="mr-2 ">저장</Button>
                                            <Button variant="negative" className="">
                                                삭제
                                            </Button>
                                        </Col>
                                        <Col className="p-0 d-flex justify-content-end">
                                            <Button variant="searching" onClick={handleClickPreview}>
                                                메일 미리보기
                                            </Button>
                                        </Col>
                                    </>
                                }
                            >
                                <TourListEdit />
                            </MokaCard>
                        )}
                    />
                </Switch>
            </div>
        </>
    );
};

export default TourList;
