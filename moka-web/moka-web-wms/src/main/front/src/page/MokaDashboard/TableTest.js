import React, { useRef } from 'react';
// import BtTable from 'react-bootstrap/Table';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { tableData, tableColumns } from './data';

const FixedTable = ({ children }) => <div className="fixed-table">{children}</div>;

const TableTest = ({ fixed }) => {
    const tableRef = useRef(null);
    const createTable = (col) => (
        <BootstrapTable
            ref={tableRef}
            bootstrap4
            bordered={false}
            keyField="name"
            data={tableData}
            columns={col}
            pagination={paginationFactory({
                sizePerPage: 10,
                sizePerPageList: [5, 10, 25, 50],
                onPageChange: (param1, param2) => {
                    console.log(param1);
                    console.log(param2);
                    console.log(tableRef.current);
                }
            })}
        />
    );

    if (fixed) {
        const columns = tableColumns.map((col) => ({
            ...col,
            headerAttrs: (cell, row, rowIndex, colIndex) => ({
                scope: 'col',
                width: col.width
            }),
            attrs: (cell, row, rowIndex, colIndex) => ({
                width: col.width
            })
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
