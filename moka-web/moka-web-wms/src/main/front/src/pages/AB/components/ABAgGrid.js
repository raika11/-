import React from 'react';
import { MokaTable } from '@components';
import { GRID_HEADER_HEIGHT, GRID_ROW_HEIGHT } from '@/style_constants';
import { StatusRenderer } from '../components';
import PropTypes from 'prop-types';

const propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    total: PropTypes.number,
    searchOptions: PropTypes.object,
};

const defaultProps = {
    columnDefs: [],
    rowData: [],
    total: 0,
    searchOptions: {
        size: 0,
        page: 0,
    },
};
/**
 * A/B 테스트 > 전체 목록 > 리스트 > AgGrid
 */
const ABAgGrid = ({ selected, columnDefs, rowData, total, searchOptions, onRowClicked, onChangeSearchOption, loading }) => {
    return (
        <React.Fragment>
            <MokaTable
                selected={selected}
                loading={loading}
                headerHeight={GRID_HEADER_HEIGHT[1]}
                className="ag-grid-align-center overflow-hidden flex-fill"
                rowHeight={GRID_ROW_HEIGHT.C[1]}
                columnDefs={columnDefs}
                rowData={rowData}
                size={searchOptions.size}
                page={searchOptions.page}
                total={total}
                onRowClicked={onRowClicked}
                onRowNodeId={(data) => data.seq}
                onChangeSearchOption={onChangeSearchOption}
                frameworkComponents={{ statusRenderer: StatusRenderer }}
            />
        </React.Fragment>
    );
};

ABAgGrid.propTypes = propTypes;
ABAgGrid.defaultProps = defaultProps;

export default ABAgGrid;
