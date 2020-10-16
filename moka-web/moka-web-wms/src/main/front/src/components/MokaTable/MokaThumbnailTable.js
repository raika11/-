import React from 'react';
import PropTypes from 'prop-types';
import { MokaPagination } from '@components';
import { MokaTemplateThumbCard } from '@/components/MokaCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

import template from '@pages/Page/template.json';

const propTypes = {
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
};

const defaultProps = {
    paging: true,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null,
};

const MokaThumbnailTable = (props) => {
    const { onClick, paging, total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    const list = template.resultInfo.body.list;

    return (
        <>
            <div className="tab-content p-0">
                <div className="mb-0 tab-pane fade border custom-scroll active show" style={{ height: '560px' }}>
                    <div className="d-flex flex-wrap align-content-start p-05">
                        {list.map((thumb) => (
                            <MokaTemplateThumbCard
                                key={thumb.templateSeq}
                                width={176}
                                height={130}
                                data={thumb}
                                img={thumb.templateThumbnail}
                                alt={'썸네일이미지'}
                                menus={[{ title: '복사본 생성' }, { title: '삭제' }]}
                                onClick={(e) => {
                                    if (onClick) {
                                        onClick(e);
                                    }
                                }}
                            />
                        ))}
                    </div>
                    {/* 페이징 */}
                    {paging ? (
                        <MokaPagination total={total} page={page} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={pageSizes} displayPageNum={displayPageNum} />
                    ) : null}
                </div>
            </div>
        </>
    );
};

MokaThumbnailTable.propTypes = propTypes;
MokaThumbnailTable.defaultProps = defaultProps;

export default MokaThumbnailTable;
