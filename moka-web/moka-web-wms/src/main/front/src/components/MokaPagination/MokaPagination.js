import React, { useCallback, useState, useEffect } from 'react';
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
     * 데이터 건수 옵션 목록
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
const MokaPagination = ({ className, total, page, size, pageSizes, paginationSize, displayPageNum, showTotalString, onChangeSearchOption }) => {
    const [pageItemsSize, setPageItemsSize] = useState('');
    const [viewPage, setViewPage] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [pageList, setPageList] = useState([]);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(false);

    const handleChangeRowsPerPage = useCallback(
        (event) => {
            onChangeSearchOption({ key: 'size', value: Number(event.target.value) });
        },
        [onChangeSearchOption],
    );

    /**
     * 이전블럭
     */
    const handleBackButtonClick = useCallback(() => {
        const movePage = startPage - 1 - 1;
        onChangeSearchOption({ key: 'page', value: movePage });
    }, [onChangeSearchOption, startPage]);

    /**
     * 다음블럭
     */
    const handleNextButtonClick = useCallback(() => {
        const movePage = endPage + 1 - 1;
        onChangeSearchOption({ key: 'page', value: movePage });
    }, [onChangeSearchOption, endPage]);

    /**
     * 페이지
     */
    const handlePageClick = useCallback(
        (event, pageNum, isActive) => {
            if (!isActive) {
                onChangeSearchOption({ key: 'page', value: pageNum });
            }
        },
        [onChangeSearchOption],
    );

    useEffect(() => {
        if (paginationSize === 'sm') {
            setPageItemsSize('sm');
        }
    }, [paginationSize]);

    useEffect(() => {
        const vp = page + 1;
        const lastPage = Math.ceil(total / size);
        let ep = Math.ceil(vp / displayPageNum) * displayPageNum;
        const sp = ep - displayPageNum + 1;

        if (ep > lastPage) ep = lastPage;

        // 보여질 페이징 목록
        let pl = [];
        for (let i = sp; i <= ep; i++) {
            pl.push(i);
        }

        // 기본 1페이지 노출
        if (pl.length === 0) {
            pl.push(1);
        }

        setViewPage(vp);
        setStartPage(sp);
        setEndPage(ep);
        setPageList(pl);
        setPrev(sp !== 1);
        setNext(!(ep * size >= total || ep === 0));
    }, [displayPageNum, page, size, total]);

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

            <Pagination className="mb-0" size={pageItemsSize}>
                <Pagination.Prev disabled={!prev} onClick={handleBackButtonClick}>
                    <MokaIcon iconName="fas-angle-left" />
                </Pagination.Prev>
                {pageList.map((value) => (
                    <Pagination.Item key={value} onClick={(e) => handlePageClick(e, value - 1, value === viewPage)} active={value === viewPage}>
                        {value}
                    </Pagination.Item>
                ))}
                <Pagination.Next disabled={!next} onClick={handleNextButtonClick}>
                    <MokaIcon iconName="fas-angle-right" />
                </Pagination.Next>
            </Pagination>

            {showTotalString && <div className="h7">{`총: ${total} 건`}</div>}
        </div>
    );
};

MokaPagination.propTypes = propTypes;
MokaPagination.defaultProps = defaultProps;

export default MokaPagination;
