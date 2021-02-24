import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { GET_DTL_LIST, getDtlList, changeDtlSearchOption } from '@store/codeMgt';
import { messageBox } from '@utils/toastUtil';
import columnDefs from './DtlAgGridColumns';
import EditDtlModal from './modals/EditDtlModal';

/**
 * 상세코드 목록의 AgGrid
 */
const DtlAgGrid = ({ grpCd }) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_DTL_LIST]);
    const { list, total, search } = useSelector(({ codeMgt }) => codeMgt.dtl);
    const [rowData, setRowData] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedSeqNo, setSelectedSeqNo] = useState(null);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let ns = { ...search, [key]: value };
        if (key !== 'page') {
            ns['page'] = 0;
        }
        dispatch(changeDtlSearchOption(ns));
        dispatch(
            getDtlList({
                search: ns,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (dtl) => {
        setSelectedSeqNo(dtl.seqNo);
        setShow(true);
    };

    useEffect(() => {
        setSelectedSeqNo(null);
    }, [grpCd]);

    useEffect(() => {
        setRowData(
            list.map((data) => {
                const [workInfo, worker] = data.modDt
                    ? ((data) => {
                          let w = `${data.modMember?.memberNm || ''}`;
                          w += data.modMember?.memberId ? `(${data.modMember?.memberId})` : '';
                          let winfo = w + '\n';
                          winfo += (data.modDt || '').slice(0, -3);
                          return [winfo, w];
                      })(data)
                    : ((data) => {
                          //   let w = `${data.regMember?.memberNm || ''}`;
                          //   w += data.regMember?.memberId ? `(${data.regMember?.memberId})` : '';
                          //   let winfo = w + '\n';
                          //   winfo += (data.regDt || '').slice(0, -3);
                          //   return [winfo, w];
                          return ['', ''];
                      })(data);

                return {
                    ...data,
                    workInfo,
                    worker,
                    grpCd: grpCd,
                };
            }),
        );
    }, [list, grpCd]);

    return (
        <React.Fragment>
            {/* table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowHeight={43}
                headerHeight={50}
                rowData={rowData}
                onRowNodeId={(dtl) => dtl.seqNo}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={selectedSeqNo}
            />

            {/* 상세코드 수정 모달 */}
            <EditDtlModal
                show={show}
                onHide={() => {
                    setShow(false);
                    setSelectedSeqNo(null);
                }}
                seqNo={selectedSeqNo}
                grpCd={grpCd}
            />
        </React.Fragment>
    );
};

export default DtlAgGrid;
