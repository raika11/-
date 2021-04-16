import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { initialState } from '@store/issue';
import { MokaCard } from '@components';
import CollapseArticle from './CollapseArticle';
import CollapseArticleAuto from './CollapseArticleAuto';
import CollapseLive from './CollapseLive';
import CollapsePacket from './CollapsePacket';
import CollapseMoviePhoto from './CollapseMoviePhoto';
import CollapseBanner from './CollapseBanner';
import CollapseKeyword from './CollapseKeyword';

/**
 * 패키지 관리 > 관련 데이터 편집
 */
const IssueDesking = () => {
    const { pkgSeq } = useParams;
    const [artInstance, setArtInstance] = useState(null);
    const [liveInstance, setLiveInstance] = useState(null);
    const [packetInstance, setPacketInstance] = useState(null);
    const [moviePhotoInstance, setMoviePhotoInstance] = useState(null);
    const [bannerInstance, setBannerInstance] = useState(null);
    const [keywordInstance, setKeywordInstance] = useState(null);

    React.useEffect(() => {
        if (artInstance) artInstance.api.setRowData([]);
    }, [artInstance]);

    React.useEffect(() => {
        if (liveInstance) liveInstance.api.setRowData([]);
    }, [liveInstance]);

    React.useEffect(() => {
        if (packetInstance) packetInstance.api.setRowData([]);
    }, [packetInstance]);

    React.useEffect(() => {
        if (moviePhotoInstance) moviePhotoInstance.api.setRowData([]);
    }, [moviePhotoInstance]);

    React.useEffect(() => {
        if (bannerInstance) bannerInstance.api.setRowData([{ ...initialState.initialDesking, pkgSeq, compNo: 7, id: 'banner-1' }]);
    }, [bannerInstance, pkgSeq]);

    React.useEffect(() => {
        if (keywordInstance) keywordInstance.api.setRowData([{ ...initialState.initialDesking, pkgSeq, compNo: 9, id: 'keyword-1' }]);
    }, [keywordInstance, pkgSeq]);

    return (
        <MokaCard header={false} className="w-100 d-flex flex-column" bodyClassName="scrollable">
            <CollapseArticle pkgSeq={pkgSeq} compNo={1} gridInstance={artInstance} setGridInstance={setArtInstance} />
            <CollapseArticleAuto compNo={2} />
            <CollapseLive pkgSeq={pkgSeq} compNo={3} gridInstance={liveInstance} setGridInstance={setLiveInstance} />
            <CollapsePacket pkgSeq={pkgSeq} compNo={4} gridInstance={packetInstance} setGridInstance={setPacketInstance} />
            <CollapseMoviePhoto pkgSeq={pkgSeq} compNo={5} gridInstance={moviePhotoInstance} setGridInstance={setMoviePhotoInstance} />
            {/* 그래프가 6번 */}
            <CollapseBanner pkgSeq={pkgSeq} compNo={7} gridInstance={bannerInstance} setGridInstance={setBannerInstance} />
            <CollapseKeyword pkgSeq={pkgSeq} compNo={8} gridInstance={keywordInstance} setGridInstance={setKeywordInstance} />
        </MokaCard>
    );
};

export default IssueDesking;
