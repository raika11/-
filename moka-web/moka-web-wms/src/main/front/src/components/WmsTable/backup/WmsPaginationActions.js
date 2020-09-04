import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '~/constants';
import PaginationActionsStyle from '~/assets/jss/components/Table/PaginationActionsStyle';

const useActionStyles = makeStyles(PaginationActionsStyle);

const WmsPaginationActions = ({ total, page, size, displayPageNum, onChangeSearchOption }) => {
    const classes = useActionStyles();

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
        [onChangeSearchOption]
    );

    // 보여질 페이징 목록
    const pageList = [];
    for (let i = startPage; i <= endPage; i++) {
        pageList.push(i);
    }

    return (
        <div className={classes.root}>
            <div className={classes.numbering}>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={!prev}
                    aria-label="이전페이지"
                    className={classes.arrrowButton}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <ButtonGroup size="small">
                    {pageList.map((value) => (
                        <Button
                            key={value}
                            variant="text"
                            onClick={(e) => handlePageClick(e, value - 1)}
                            disableElevation
                            className={clsx(classes.numberButton, {
                                [classes.numberSelectedButton]: value === viewPage
                            })}
                        >
                            {value}
                        </Button>
                    ))}
                </ButtonGroup>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={!next}
                    aria-label="다음페이지"
                    className={classes.arrrowButton}
                >
                    <KeyboardArrowRight />
                </IconButton>
            </div>
            <div className={classes.total}>
                <Typography className={classes.totalText}>{`총: ${total} 건`}</Typography>
            </div>
        </div>
    );
};

WmsPaginationActions.propTypes = {
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
     * 그룹당 페이지 개수
     */
    displayPageNum: PropTypes.number,
    /**
     * 페이지 변경
     */
    onChangeSearchOption: PropTypes.func
};

WmsPaginationActions.defaultProps = {
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null
};

export default WmsPaginationActions;
