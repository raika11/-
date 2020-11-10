import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { MokaIcon } from '@components';

import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

export const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 총갯수
     */
    total: PropTypes.number,
    /**
     * 총갯수 텍스트 show/hide
     */
    showTotalString: PropTypes.bool,
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
     * pageSizes == false이면 페이지사이즈 보이지 않음
     */
    pageSizes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.bool]),
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
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null,
    showTotalString: true,
    className: 'justify-content-between',
};

/**
 * 페이지네이션
 */
const MokaPagination = (props) => {
    const { className, total, page, size, pageSizes, displayPageNum, showTotalString, onChangeSearchOption } = props;

    const handleChangeRowsPerPage = useCallback(
        (event) => {
            onChangeSearchOption({ key: 'size', value: Number(event.target.value) });
        },
        [onChangeSearchOption],
    );

    const viewPage = page + 1;
    let endPage = Math.ceil(viewPage / displayPageNum) * displayPageNum;
    const startPage = endPage - displayPageNum + 1;
    const lastPage = Math.ceil(total / size);

    if (endPage > lastPage) {
        endPage = lastPage;
    }

    const prev = startPage !== 1;
    const next = !(endPage * size >= total || endPage === 0);

    // 이전블럭
    const handleBackButtonClick = useCallback(() => {
        const movePage = startPage - 1 - 1;
        onChangeSearchOption({ key: 'page', value: movePage });
    }, [onChangeSearchOption, startPage]);

    // 다음블럭
    const handleNextButtonClick = useCallback(() => {
        const movePage = endPage + 1 - 1;
        onChangeSearchOption({ key: 'page', value: movePage });
    }, [onChangeSearchOption, endPage]);

    // 페이지
    const handlePageClick = useCallback(
        (event, pageNum) => {
            onChangeSearchOption({ key: 'page', value: pageNum });
        },
        [onChangeSearchOption],
    );

    // 보여질 페이징 목록
    const pageList = [];
    for (let i = startPage; i <= endPage; i++) {
        pageList.push(i);
    }

    return (
        <div className={clsx('d-flex', 'align-items-center', className)}>
            {pageSizes && (
                <Form.Control as="select" style={{ width: 65, height: 29 }} onChange={handleChangeRowsPerPage} value={size} custom>
                    {pageSizes.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </Form.Control>
            )}
            <Pagination className="mb-0">
                <Pagination.Prev disabled={!prev} onClick={handleBackButtonClick}>
                    <MokaIcon iconName="fas-angle-left" />
                </Pagination.Prev>
                {pageList.map((value) => (
                    <Pagination.Item key={value} onClick={(e) => handlePageClick(e, value - 1)} active={value === viewPage}>
                        {value}
                    </Pagination.Item>
                ))}
                <Pagination.Next disabled={!next} onClick={handleNextButtonClick}>
                    <MokaIcon iconName="fas-angle-right" />
                </Pagination.Next>
            </Pagination>
            {showTotalString && <div>{`총: ${total} 건`}</div>}
        </div>
    );
};

MokaPagination.propTypes = propTypes;
MokaPagination.defaultProps = defaultProps;

export default MokaPagination;
