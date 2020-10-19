import React from 'react';
import PropTypes from 'prop-types';
import { MokaPagination } from '@components';
import { MokaTemplateThumbCard } from '@/components/MokaCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

import template from '@pages/Page/template.json';

const propTypes = {
    /**
     * tableHeight 테이블 Height
     */
    tableHeight: PropTypes.number,
    /**
     * 페이징여부
     */
    paging: PropTypes.bool,
    /**
     * 총갯수
     */
    total: PropTypes.number,
    /**
     * 페이지번호( zero base )
     */
    page: PropTypes.number,
    /**
     * 페이지당 데이타 건수
     */
    size: PropTypes.number,
    /**
     * 데이타 건수 옵션 목록
     */
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    /**
     * 그룹당 페이지 개수
     */
    displayPageNum: PropTypes.number,
    /**
     * 검색조건 변경 ( 페이지, 데이타건수 변경 )
     */
    onChangeSearchOption: PropTypes.func,
    /**
     * 썸네일 카드의 오른쪽 드롭다운 메뉴에 들어갈 리스트의 객체
     */
    menus: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            onClick: PropTypes.func,
        }),
    ),
};

const defaultProps = {
    paging: true,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null,
    menus: [],
};

/**
 * 썸네일 테이블
 */
const MokaThumbnailTable = (props) => {
    const { tableHeight, onClick, paging, total, page, size, pageSizes, displayPageNum, onChangeSearchOption, menus } = props;
    const list = template.resultInfo.body.list;

    return (
        <>
            <div className="mb-3 border" style={{ height: tableHeight }}>
                <div className="d-flex flex-wrap align-content-start custom-scroll p-05 h-100 overflow-y-scroll">
                    {list.map((thumb) => (
                        <MokaTemplateThumbCard
                            key={thumb.templateSeq}
                            width={174}
                            height={130}
                            data={thumb}
                            img={thumb.templateThumbnail}
                            alt={'썸네일이미지'}
                            menus={menus}
                            onClick={onClick}
                        />
                    ))}
                </div>
            </div>
            {/* 페이징 */}
            {paging && <MokaPagination total={total} page={page} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={pageSizes} displayPageNum={displayPageNum} />}
        </>
    );
};

MokaThumbnailTable.propTypes = propTypes;
MokaThumbnailTable.defaultProps = defaultProps;

export default MokaThumbnailTable;
