import React from 'react';
import PropTypes from 'prop-types';
import { WmsThumbnailCard } from '~/components';

/**
 * 테이블 목록
 * @param {} props classes 스타일
 * @param {} props boxWidth 이미지영역의 가로
 * @param {} props boxHeight 이미지영역의 세로
 * @param {} props rows 데이타
 * @param {} props columns 칼럼정의
 * @param {} props currentId 선택된 아이디
 * @param {} props onRowClick Row클릭
 */
const WmsThumbnailTableBody = (props) => {
    const { classes } = props;
    const { boxWidth, boxHeight, rows, currentId } = props;
    // const { isSelected, onRowClick } = props;
    const { onRowClick, onActionBtnClick, actionButtons } = props;

    return (
        <div className={classes.imageBody}>
            {rows &&
                rows.map((row) => {
                    const useYn = !(row.useYn && row.useYn === 'N');
                    const onActionBtnClickWithParam = onActionBtnClick
                        ? ({ anchorRef }) => {
                              onActionBtnClick(row, anchorRef);
                          }
                        : undefined;
                    const actionButtonsWidthData = actionButtons.map((b) => ({
                        ...b,
                        onClick: ({ anchorRef }) => b.onClick(row, anchorRef)
                    }));
                    return (
                        <WmsThumbnailCard
                            key={row.id}
                            img={row.imageSrc}
                            width={boxWidth}
                            height={boxHeight}
                            useYn={useYn}
                            title={row.title}
                            body={row.body}
                            overlayText={row.overlayText}
                            overrideClassName={classes.imageCell}
                            onClick={(event) => onRowClick(event, row)}
                            onActionBtnClick={onActionBtnClickWithParam}
                            actionButtons={actionButtonsWidthData}
                            selected={currentId === row.id}
                        />
                    );
                })}
        </div>
    );
};

WmsThumbnailTableBody.propTypes = {
    /**
     * 이미지영역의 가로
     */
    boxWidth: PropTypes.number,
    /**
     * 이미지영역의 세로
     */
    boxHeight: PropTypes.number,
    /**
     * 스타일
     */
    classes: PropTypes.object,
    /**
     * 컬럼정의
     */
    columns: PropTypes.arrayOf(PropTypes.object),
    /**
     * 데이타
     */
    rows: PropTypes.arrayOf(PropTypes.object),
    /**
     * 선택된 아이디
     */
    currentId: PropTypes.string,
    /**
     * 체크된 목록
     */
    // isSelected: PropTypes.func,
    /**
     * Row클릭
     */
    onRowClick: PropTypes.func,
    /**
     * 팝업메뉴 우클릭
     */
    onContextMenuOpen: PropTypes.func
};

WmsThumbnailTableBody.defaultProps = {
    boxWidth: 183,
    boxHeight: 130,
    classes: null,
    columns: null,
    rows: null,
    currentId: null,
    // order: 'asc',
    // orderBy: '',
    // isSelected: null,
    onRowClick: null,
    onContextMenuOpen: null
};

export default WmsThumbnailTableBody;
