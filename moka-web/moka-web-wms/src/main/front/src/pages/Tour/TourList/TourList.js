import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MokaCard } from '@/components';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { clearStore } from '@/store/tour';
import TourListApplyList from './TourListApplyList';
import TourListEdit from './TourListEdit';

/**
 * 견학 신청 목록
 */
const TourList = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const editRef = useRef();

    /**
     * 수정 버튼
     */
    const handleClickSave = () => {
        if (editRef.current) {
            editRef.current.onSave();
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        if (editRef.current) {
            editRef.current.onDelete();
        }
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push(match.url);
    };

    /**
     * 메일 미리보기 버튼
     */
    const handleClickPreview = () => {
        window.open(``, '메일 미리보기');
    };

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex">
            <Helmet>
                <title>신청 목록</title>
                <meta name="description" content="견학 신청 목록 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 신청 목록 */}
            <MokaCard width={948} titleClassName="mb-0" className="mr-gutter" bodyClassName="d-flex flex-column" title="신청 목록">
                <TourListApplyList match={match} />
            </MokaCard>

            {/* 견학 신청서 */}
            <Switch>
                <Route
                    path={[`${match.url}/:tourSeq`]}
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
                                        <Button variant="positive" className="mr-2" onClick={handleClickSave}>
                                            수정
                                        </Button>
                                        <Button variant="negative" className="mr-2" onClick={handleClickDelete}>
                                            삭제
                                        </Button>
                                        <Button variant="negative" onClick={handleClickCancel}>
                                            취소
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
                            <TourListEdit match={match} ref={editRef} />
                        </MokaCard>
                    )}
                />
            </Switch>
        </div>
    );
};

export default TourList;
