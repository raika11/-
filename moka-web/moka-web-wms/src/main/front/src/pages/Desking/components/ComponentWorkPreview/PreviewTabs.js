import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { MokaCardTabs } from '@components';
import CommonPreview from './CommonPreview';

/**
 * 컴포넌트 미리보기 탭
 * Wide, PC, Tablet, Mobile
 */
const PreviewTabs = ({ show, componentList, isNaverChannel }) => {
    const area = useSelector(({ desking }) => desking.area);
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 전체화면 미리보기
     */
    const handleClickPreview = () => {
        if (area.areaSeq) {
            window.open(`${API_BASE_URL}/preview/desking/area?areaSeq=${area.areaSeq}`, '미리보기');
        }
    };

    return (
        <React.Fragment>
            <MokaCardTabs
                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                className="w-100 h-100"
                tabNavs={['Wide', 'PC', 'Tablet', 'Mobile']}
                tabs={[
                    /**
                     * Wide 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 0} breakpoint="wide" componentList={componentList} isNaverChannel={isNaverChannel} />,
                    /**
                     * PC 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 1} breakpoint="pc" componentList={componentList} isNaverChannel={isNaverChannel} />,
                    /**
                     * Tablet 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 2} breakpoint="tablet" componentList={componentList} isNaverChannel={isNaverChannel} />,
                    /**
                     * Mobile 미리보기
                     */
                    <CommonPreview show={show && activeTabIdx === 3} breakpoint="mobile" componentList={componentList} isNaverChannel={isNaverChannel} />,
                ]}
            />
            <Button variant="outline-neutral" className="position-absolute" style={{ top: 10, right: 24 }} onClick={handleClickPreview} disabled={!area.page}>
                전체화면으로 보기
            </Button>
        </React.Fragment>
    );
};

export default PreviewTabs;
