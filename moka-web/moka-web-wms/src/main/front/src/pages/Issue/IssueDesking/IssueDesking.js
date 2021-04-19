import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getIssueDesking, GET_ISSUE_DESKING } from '@store/issue';
import { MokaCard } from '@components';
import CollapseArticle from './CollapseArticle';
import CollapseArticleAuto from './CollapseArticleAuto';
import CollapseLive from './CollapseLive';
import CollapsePacket from './CollapsePacket';
import CollapseMoviePhoto from './CollapseMoviePhoto';
import CollapseBanner from './CollapseBanner';
import CollapseKeyword from './CollapseKeyword';

const MESSAGE = {
    FAIL_PUBLISH_UNTIL_SAVE: '편집된 정보가 있습니다. 임시저장 버튼을 클릭 후\n전송 버튼을 클릭하여 주세요',
    FAIL_PUBLISH_NO_SAVE: '임시저장 데이터가 없습니다. 임시저장 버튼을 클릭 후\n전송 버튼을 클릭하여 주세요.',
};

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const { pkgSeq } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_DESKING]);
    const { pkg, desking } = useSelector(({ issue }) => ({
        pkg: issue.pkg,
        desking: issue.desking,
    }));
    const [deskingByCompNo, setDeskingByCompNo] = useState({});
    const [artInstance, setArtInstance] = useState(null);
    const [liveInstance, setLiveInstance] = useState(null);
    const [packetInstance, setPacketInstance] = useState(null);
    const [moviePhotoInstance, setMoviePhotoInstance] = useState(null);
    const [bannerInstance, setBannerInstance] = useState(null);
    const [keywordInstance, setKeywordInstance] = useState(null);

    useEffect(() => {
        if (pkg.pkgSeq) {
            dispatch(
                getIssueDesking({
                    pkgSeq: pkg.pkgSeq,
                }),
            );
        }
    }, [pkg.pkgSeq, dispatch]);

    useEffect(() => {
        // 데스킹 => compNo별 데스킹 데이터로 파싱
        setDeskingByCompNo(desking.reduce((all, compData) => ({ ...all, [`comp${compData.compNo}`]: compData }), {}));
    }, [desking]);

    return (
        <MokaCard header={false} className="w-100 d-flex flex-column" bodyClassName="scrollable" loading={loading}>
            {/* 메인기사(편집) */}
            <CollapseArticle
                pkgSeq={pkgSeq}
                compNo={1}
                gridInstance={artInstance}
                setGridInstance={setArtInstance}
                desking={deskingByCompNo.comp1 || {}}
                deskingList={deskingByCompNo.comp1?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 메인기사(자동) */}
            <CollapseArticleAuto compNo={2} desking={deskingByCompNo.comp2 || {}} />
            {/* 라이브기사 */}
            <CollapseLive
                pkgSeq={pkgSeq}
                compNo={3}
                gridInstance={liveInstance}
                setGridInstance={setLiveInstance}
                desking={deskingByCompNo.comp3 || {}}
                deskingList={deskingByCompNo.comp3?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 관련기사꾸러미 */}
            <CollapsePacket
                pkgSeq={pkgSeq}
                compNo={4}
                gridInstance={packetInstance}
                setGridInstance={setPacketInstance}
                desking={deskingByCompNo.comp4 || {}}
                deskingList={deskingByCompNo.comp4?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 영상/포토 */}
            <CollapseMoviePhoto
                pkgSeq={pkgSeq}
                compNo={5}
                gridInstance={moviePhotoInstance}
                setGridInstance={setMoviePhotoInstance}
                desking={deskingByCompNo.comp5 || {}}
                deskingList={deskingByCompNo.comp5?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 그래프가 6번 */}
            {/* 배너 */}
            <CollapseBanner
                pkgSeq={pkgSeq}
                compNo={6}
                gridInstance={bannerInstance}
                setGridInstance={setBannerInstance}
                desking={deskingByCompNo.comp6 || {}}
                deskingList={deskingByCompNo.comp6?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 키워드 */}
            <CollapseKeyword
                pkgSeq={pkgSeq}
                compNo={7}
                gridInstance={keywordInstance}
                setGridInstance={setKeywordInstance}
                desking={deskingByCompNo.comp7 || {}}
                deskingList={deskingByCompNo.comp7?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
        </MokaCard>
    );
};

export default IssueDesking;
