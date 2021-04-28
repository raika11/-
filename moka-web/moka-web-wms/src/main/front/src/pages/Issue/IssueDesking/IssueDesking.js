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
// import CollapsePacket from './CollapsePacket';
import CollapseMoviePhoto from './CollapseMoviePhoto';
import CollapseBanner from './CollapseBanner';
import CollapseKeyword from './CollapseKeyword';

const MESSAGE = {
    FAIL_PUBLISH_UNTIL_SAVE: '편집된 정보가 있습니다. 임시저장 버튼을 클릭 후\n전송 버튼을 클릭하여 주세요',
    FAIL_PUBLISH_NO_SAVE: '임시저장 데이터가 없습니다. 임시저장 버튼을 클릭 후\n전송 버튼을 클릭하여 주세요.',
    FAIL_SAVE_NO_DATA: '데이터를 하나 이상 추가해주세요.',
};

/**
 * rowNode의 데이터를 issueDeskings 리스트로 변환
 * @param {array} rows rowNode의 데이터 리스트
 * @param {string} viewYn Y || N
 * @returns issueDeskings 리스트
 */
const rowToData = (rows, viewYn) =>
    rows.map((r) => {
        const result = { ...r, viewYn };
        delete result.id;
        delete result.afterOnChange;
        return result;
    });

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const { pkgSeq } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_DESKING]);
    // const domainId = useSelector(({ auth }) => auth.latsetDomainId);
    const { pkg, desking } = useSelector(({ issue }) => ({
        pkg: issue.pkg,
        desking: issue.desking,
    }));
    const [deskingByCompNo, setDeskingByCompNo] = useState({});
    const [opaBox, setOpaBox] = useState(true);
    const [opaText, setOpaText] = useState('패키지 정보가 없습니다');
    const artRef = useRef(null);
    const artAutoRef = useRef(null);
    const liveRef = useRef(null);
    // const packetRef = useRef(null);
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

        // packet work => delete
        const comp4 = {
            pkgSeq,
            compNo: 4,
            viewYn: 'N',
            issueDeskings: [],
            // viewYn: packetRef.current.viewYn,
            // issueDeskings: packetRef.current.getDisplayedRows(),
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
        // util.newTabPreview(`${API_BASE_URL}/preview/issue/${pkgSeq}`, { issueDeskings: previewData, domainId: PREVIEW_DOMAIN_ID });
        util.newTabPreview(`${API_BASE_URL}/preview/issue/${pkgSeq}`, { issueDeskings: previewData, domainId: 2000 });
    }, [pkgSeq]);

    useEffect(() => {
        if (pkgSeq) {
            if (pkg.pkgDiv === 'I' && pkg.pkgType === 'E') {
                dispatch(
                    getIssueDesking({
                        pkgSeq,
                    }),
                );
                setOpaBox(false);
            } else {
                setDeskingByCompNo({});
                setOpaBox(true);
                setOpaText('확장형 이슈 유형의 패키지만 편집할 수 있습니다');
            }
        } else {
            setDeskingByCompNo({});
            setOpaBox(true);
            setOpaText('패키지 정보가 없습니다');
        }

        return () => {
            setDeskingByCompNo({});
            setOpaBox(true);
            setOpaText('패키지 정보가 없습니다');
        };
    }, [pkg, pkgSeq, dispatch]);

    useEffect(() => {
        // 데스킹 => compNo별 데스킹 데이터로 파싱 (viewYn === 'Y'만 노출)
        setDeskingByCompNo(
            desking.reduce(
                (all, compData) => ({
                    ...all,
                    [`comp${compData.compNo}`]: {
                        ...compData,
                        issueDeskings: (compData.issueDeskings || []).filter((d) => d.viewYn === 'Y'),
                    },
                }),
                {},
            ),
        );
    }, [desking]);

    return (
        <MokaCard header={false} className="w-100 d-flex flex-column" bodyClassName="scrollable position-relative" loading={loading}>
            {opaBox && (
                <div className="opacity-box">
                    <h2>{opaText}</h2>
                </div>
            )}
            {/* 메인기사(편집) */}
            <CollapseArticle
                pkgSeq={pkgSeq}
                compNo={1}
                ref={artRef}
                desking={deskingByCompNo.comp1}
                deskingList={deskingByCompNo.comp1?.issueDeskings}
                preview={preview}
                MESSAGE={MESSAGE}
                rowToData={rowToData}
                rowHeight={198}
            />
            {/* 라이브기사 */}
            <CollapseLive
                pkgSeq={pkgSeq}
                compNo={3}
                ref={liveRef}
                desking={deskingByCompNo.comp3}
                deskingList={deskingByCompNo.comp3?.issueDeskings}
                preview={preview}
                MESSAGE={MESSAGE}
                rowToData={rowToData}
                rowHeight={90}
            />
            {/* 관련기사꾸러미 */}
            {/* <CollapsePacket
                pkgSeq={pkgSeq}
                compNo={4}
                ref={packetRef}
                desking={deskingByCompNo.comp4}
                deskingList={deskingByCompNo.comp4?.issueDeskings}
                MESSAGE={MESSAGE}
                rowToData={rowToData}
                rowHeight={90}
            /> */}
            {/* 영상포토 */}
            <CollapseMoviePhoto
                pkgSeq={pkgSeq}
                compNo={5}
                ref={mpRef}
                desking={deskingByCompNo.comp5}
                deskingList={deskingByCompNo.comp5?.issueDeskings}
                preview={preview}
                MESSAGE={MESSAGE}
                rowToData={rowToData}
                rowHeight={165}
            />
            {/* 그래프가 6번 */}
            {/* 배너 */}
            <CollapseBanner
                pkgSeq={pkgSeq}
                compNo={7}
                ref={bannerRef}
                desking={deskingByCompNo.comp7}
                deskingList={deskingByCompNo.comp7?.issueDeskings}
                preview={preview}
                MESSAGE={MESSAGE}
                rowToData={rowToData}
                rowHeight={90}
            />
            {/* 키워드 */}
            <CollapseKeyword
                pkgSeq={pkgSeq}
                compNo={8}
                ref={keywordRef}
                desking={deskingByCompNo.comp8}
                deskingList={deskingByCompNo.comp8?.issueDeskings}
                preview={preview}
                MESSAGE={MESSAGE}
                rowToData={rowToData}
                rowHeight={90}
            />
            {/* 데이터기사(자동) */}
            <CollapseArticleAuto ref={artAutoRef} pkgSeq={pkgSeq} compNo={2} desking={deskingByCompNo.comp2} MESSAGE={MESSAGE} />
        </MokaCard>
    );
};

export default IssueDesking;
