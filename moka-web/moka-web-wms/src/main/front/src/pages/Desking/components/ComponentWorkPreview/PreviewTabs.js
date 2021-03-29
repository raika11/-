import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { MokaCardTabs } from '@components';
import CommonPreview from './CommonPreview';

/**
 * 컴포넌트 미리보기 탭
 * Wide, PC, Tablet, Mobile
 */
const PreviewTabs = ({ show, isNaverChannel, isNaverStand, componentList }) => {
    const area = useSelector(({ desking }) => desking.area);
    const [activeTabIdx, setActiveTabIdx] = useState(3);

    /**
     * 전체화면 미리보기
     */
    const handleClickPreview = () => {
        if (area.areaSeq) {
            window.open(`${API_BASE_URL}/preview/desking/area?areaSeq=${area.areaSeq}`, '미리보기');
        }
    };

    useEffect(() => {
        isNaverStand ? setActiveTabIdx(1) : setActiveTabIdx(3);
    }, [isNaverStand]);

    return (
        <React.Fragment>
            <MokaCardTabs
                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                className="w-100 h-100"
                activeKey={activeTabIdx}
                tabNavs={[
                    !isNaverStand && !isNaverChannel && { idx: 0, name: 'Wide' },
                    !isNaverChannel && { idx: 1, name: 'PC' }, // 네이버스탠드 => PC만 노출
                    !isNaverStand && !isNaverChannel && { idx: 2, name: 'Tablet' },
                    !isNaverStand && { idx: 3, name: 'Mobile' }, // 네이버채널 => M만 노출
                ].filter(Boolean)}
                tabs={[
                    /**
                     * Wide 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 0} componentList={componentList} breakpoint="wide" />,
                    /**
                     * PC 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 1} componentList={componentList} breakpoint="pc" />,
                    /**
                     * Tablet 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 2} componentList={componentList} breakpoint="tablet" />,
                    /**
                     * Mobile 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 3} componentList={componentList} breakpoint="mobile" isNaverChannel={isNaverChannel} />,
                ]}
            />
            <Button variant="outline-neutral" className="position-absolute" style={{ top: 10, right: 24 }} onClick={handleClickPreview} disabled={!area.page}>
                전체화면으로 보기
            </Button>
        </React.Fragment>
    );
};

export default PreviewTabs;
