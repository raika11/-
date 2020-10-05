import React, { useRef, useCallback } from 'react';
import clsx from 'clsx';
// import BtTable from 'react-bootstrap/Table';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faStepBackward, faStepForward } from '@moka/fontawesome-pro-solid-svg-icons';

import { tableData, tableColumns } from './data';

const FixedTable = ({ children }) => <div className="fixed-table">{children}</div>;

const TableTest = ({ fixed }) => {
    const tableRef = useRef(null);

    // 페이지네이션 커스텀
    const pageListRenderer = useCallback(({ pages, onPageChange }) => {
        // just exclude <, <<, >>, >
        // const pageWithoutIndication = pages.filter((p) => typeof p.page !== 'string');
        return (
            <div className="react-bootstrap-table-pagination-list col-md-6 col-xs-6 col-sm-6 col-lg-6">
                <div className="pagination react-bootstrap-table-page-btns-ul">
                    {pages.map((p) => (
                        <button
                            key={p.page}
                            className={clsx('btn', 'mr-2', {
                                'btn-primary': !p.active,
                                'btn-warning': p.active,
                            })}
                            onClick={() => onPageChange(p.page)}
                        >
                            {p.title === 'next page' ? (
                                <FontAwesomeIcon icon={faChevronRight} />
                            ) : p.title === 'previous page' ? (
                                <FontAwesomeIcon icon={faChevronLeft} />
                            ) : p.title === 'first page' ? (
                                <FontAwesomeIcon icon={faStepBackward} />
                            ) : p.title === 'last page' ? (
                                <FontAwesomeIcon icon={faStepForward} />
                            ) : (
                                p.page
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }, []);

    const createTable = (col) => (
        <BootstrapTable
            ref={tableRef}
            bootstrap4
            bordered={false}
            keyField="name"
            data={tableData}
            columns={col}
            pagination={paginationFactory({
                paginationSize: 10,
                sizePerPage: 10,
                sizePerPageList: [5, 10, 25, 50],
                prePageText: '<',
                nextPageText: '>',
                showTotal: true,
                pageListRenderer,
                onPageChange: (param1, param2) => {
                    console.log(param1);
                    console.log(param2);
                    console.log(tableRef.current);
                },
            })}
        />
    );

    if (fixed) {
        const columns = tableColumns.map((col) => ({
            ...col,
            headerAttrs: (cell, row, rowIndex, colIndex) => ({
                scope: 'col',
                width: col.width,
            }),
            attrs: (cell, row, rowIndex, colIndex) => ({
                width: col.width,
            }),
        }));
        return <FixedTable>{createTable(columns)}</FixedTable>;
    }
    return createTable(tableColumns);
    // return (
    //     <>
    //         {/* <BtTable style={{ height: '300px' }}>
    //             <thead>
    //                 <tr>
    //                     {columns.map((header) => (
    //                         <th scope="col" width={header.width}>
    //                             {header.text}
    //                         </th>
    //                     ))}
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {tableData.map((d, idx) => (
    //                     <tr key={idx}>
    //                         {columns.map((header, hidx) => (
    //                             <td key={hidx} width={header.width}>
    //                                 {d[header.dataField]}
    //                             </td>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </BtTable> */}
    //         <FixedTable>

    //         </FixedTable>
    //     </>
    // );
};

export default TableTest;
