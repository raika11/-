import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '@/constants';
import { getIssueDesking, GET_ISSUE_DESKING } from '@store/issue';
import util from '@utils/commonUtil';
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
    FAIL_SAVE_NO_DATA: '데이터를 하나 이상 추가해주세요.',
};

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const { pkgSeq } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_DESKING]);
    const domainId = useSelector(({ auth }) => auth.latsetDomainId);
    const { pkg, desking } = useSelector(({ issue }) => ({
        pkg: issue.pkg,
        desking: issue.desking,
    }));
    const [deskingByCompNo, setDeskingByCompNo] = useState({});
    const artRef = useRef(null);
    const artAutoRef = useRef(null);
    const liveRef = useRef(null);
    const packetRef = useRef(null);
    const mpRef = useRef(null);
    const bannerRef = useRef(null);
    const keywordRef = useRef(null);

    /**
     * 미리보기
     */
    const preview = useCallback(() => {
        // article work
        const comp1 = {
            pkgSeq,
            compNo: 1,
            viewYn: artRef.current.viewYn,
            issueDeskings: artRef.current.getDisplayedRows(),
        };

        // article auto work
        const comp2 = {
            pkgSeq,
            compNo: 2,
            viewYn: artAutoRef.current.viewYn,
            issueDeskings: [],
        };

        // live work
        const comp3 = {
            pkgSeq,
            compNo: 3,
            viewYn: liveRef.current.viewYn,
            issueDeskings: liveRef.current.getDisplayedRows(),
        };

        // packet work
        const comp4 = {
            pkgSeq,
            compNo: 4,
            viewYn: packetRef.current.viewYn,
            issueDeskings: packetRef.current.getDisplayedRows(),
        };

        // mp work
        const comp5 = {
            pkgSeq,
            compNo: 5,
            viewYn: mpRef.current.viewYn,
            issueDeskings: mpRef.current.getDisplayedRows(),
        };

        // graph work (TODO)
        const comp6 = {
            pkgSeq,
            compNo: 6,
            viewYn: 'N',
            issueDeskings: [],
        };

        // banner work
        const comp7 = {
            pkgSeq,
            compNo: 7,
            viewYn: bannerRef.current.viewYn,
            issueDeskings: bannerRef.current.getDisplayedRows(),
        };

        // keyword work
        const comp8 = {
            pkgSeq,
            compNo: 8,
            viewYn: keywordRef.current.viewYn,
            issueDeskings: keywordRef.current.getDisplayedRows(),
        };

        const previewData = [comp1, comp2, comp3, comp4, comp5, comp6, comp7, comp8];
        util.newTabPreview(`${API_BASE_URL}/preview/issue/${pkgSeq}`, { issueDeskings: previewData, domainId });
    }, [pkgSeq, domainId]);

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
                ref={artRef}
                desking={deskingByCompNo.comp1 || {}}
                deskingList={deskingByCompNo.comp1?.issueDeskings || []}
                preview={preview}
                MESSAGE={MESSAGE}
            />
            {/* 메인기사(자동) */}
            <CollapseArticleAuto ref={artAutoRef} compNo={2} desking={deskingByCompNo.comp2 || {}} />
            {/* 라이브기사 */}
            <CollapseLive
                pkgSeq={pkgSeq}
                compNo={3}
                ref={liveRef}
                desking={deskingByCompNo.comp3 || {}}
                deskingList={deskingByCompNo.comp3?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 관련기사꾸러미 */}
            <CollapsePacket
                pkgSeq={pkgSeq}
                compNo={4}
                ref={packetRef}
                desking={deskingByCompNo.comp4 || {}}
                deskingList={deskingByCompNo.comp4?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 영상/포토 */}
            <CollapseMoviePhoto
                pkgSeq={pkgSeq}
                compNo={5}
                ref={mpRef}
                desking={deskingByCompNo.comp5 || {}}
                deskingList={deskingByCompNo.comp5?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 그래프가 6번 */}
            {/* 배너 */}
            <CollapseBanner
                pkgSeq={pkgSeq}
                compNo={6}
                ref={bannerRef}
                desking={deskingByCompNo.comp6 || {}}
                deskingList={deskingByCompNo.comp6?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
            {/* 키워드 */}
            <CollapseKeyword
                pkgSeq={pkgSeq}
                compNo={7}
                ref={keywordRef}
                desking={deskingByCompNo.comp7 || {}}
                deskingList={deskingByCompNo.comp7?.issueDeskings || []}
                MESSAGE={MESSAGE}
            />
        </MokaCard>
    );
};

export default IssueDesking;
