import React, { useState } from 'react';
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
        if (bannerInstance) bannerInstance.api.setRowData([{ id: 'banner-1' }]);
    }, [bannerInstance]);

    React.useEffect(() => {
        if (keywordInstance) keywordInstance.api.setRowData([{ id: 'keyword-1' }]);
    }, [keywordInstance]);

    return (
        <MokaCard header={false} className="w-100 d-flex flex-column" bodyClassName="scrollable">
            <CollapseArticle gridInstance={artInstance} setGridInstance={setArtInstance} />
            <CollapseArticleAuto />
            <CollapseLive gridInstance={liveInstance} setGridInstance={setLiveInstance} />
            <CollapsePacket gridInstance={packetInstance} setGridInstance={setPacketInstance} />
            <CollapseMoviePhoto gridInstance={moviePhotoInstance} setGridInstance={setMoviePhotoInstance} />
            <CollapseBanner gridInstance={bannerInstance} setGridInstance={setBannerInstance} />
            <CollapseKeyword gridInstance={keywordInstance} setGridInstance={setKeywordInstance} />
        </MokaCard>
    );
};

export default IssueDesking;
