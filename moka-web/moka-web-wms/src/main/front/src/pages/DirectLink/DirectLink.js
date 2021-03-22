import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { MokaCard } from '@components';
import { clearStore } from '@store/directLink';
import DirectLinkEdit from './DirectLinkEdit';
import DirectLinkList from './DirectLinkList';

/**
 * 사이트 바로 가기 관리
 */
const DirectLink = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>사이트 바로 가기</title>
                <meta name="description" content="사이트 바로 가기 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={940} className="mr-gutter" bodyClassName="d-flex flex-column" title="사이트 바로 가기">
                <DirectLinkList match={match} />
            </MokaCard>

            {/* 등록/수정창 */}
            <Route path={[`${match.path}/add`, `${match.path}/:linkSeq`]} exact render={(props) => <DirectLinkEdit {...props} match={match} />} />
        </div>
    );
};

export default DirectLink;
