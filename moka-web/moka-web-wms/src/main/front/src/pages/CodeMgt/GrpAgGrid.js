import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { GET_GRP_LIST, getGrpList, changeGrpSearchOption } from '@store/codeMgt';
import EditGrpModal from './modals/EditGrpModal';
import columnDefs from './GrpAgGridColumns';

/**
 * 그룹 목록의 AgGrid
 */
const GrpAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_GRP_LIST]);
    const { total, list, search } = useSelector(({ codeMgt }) => codeMgt.grp);
    const { search: dtlSearch } = useSelector(({ codeMgt }) => codeMgt.dtl);
    const [rowData, setRowData] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedGrpCd, setSelectedGrpCd] = useState();

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let ns = { ...search, [key]: value };
        if (key !== 'page') {
            ns['page'] = 0;
        }
        dispatch(changeGrpSearchOption(ns));
        dispatch(
            getGrpList({
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
    const handleRowClicked = (grp) => history.push(`${match.path}/${grp.grpCd}`);

    useEffect(() => {
        if (list.length > 0) {
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
                        worker,
                        workInfo,
                        edit: (data) => {
                            setShow(true);
                            setSelectedGrpCd(data.grpCd);
                        },
                    };
                }),
            );
        } else {
            setRowData([]);
        }
    }, [list]);

    return (
        <React.Fragment>
            <MokaTable
                className="overflow-hidden flex-fill"
                rowHeight={43}
                headerHeight={50}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(grp) => grp.grpCd}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                onChangeSearchOption={handleChangeSearchOption}
                selected={dtlSearch.grpCd}
                preventRowClickCell={['edit']}
            />

            {/* 그룹 수정 모달 */}
            <EditGrpModal show={show} onHide={() => setShow(false)} grpCd={selectedGrpCd} />
        </React.Fragment>
    );
};

export default GrpAgGrid;
