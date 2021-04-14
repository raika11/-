import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { deleteTourDeny, getTourDenyList, GET_TOUR_DENY_LIST } from '@store/tour';
import toast, { messageBox } from '@utils/toastUtil';
import { MokaTable, MokaCard } from '@components';
import HolidayRegistrationModal from './modals/HolidayRegistrationModal';
import columnDefs from './HolidayAgGridColumns';

/**
 * 견학 > 기본 설정 > 휴일 목록 > AgGrid
 */
const HolidayAgGrid = () => {
    const dispatch = useDispatch();
    const holidayList = useSelector((store) => store.tour.holidayList);
    const loading = useSelector((store) => store.loading[GET_TOUR_DENY_LIST]);
    const [show, setShow] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [modalData, setModalData] = useState(null);

    /**
     * 등록 버튼
     */
    const handleClickAdd = () => {
        setModalData(null);
        setShow(true);
    };

    /**
     * 수정 버튼
     */
    const handleClickModify = useCallback((data) => {
        setModalData(data);
        setShow(true);
    }, []);

    /**
     * 삭제 버튼
     */
    const handleClickDelete = useCallback(
        (data) => {
            messageBox.confirm(
                '삭제하시겠습니까?',
                () => {
                    dispatch(
                        deleteTourDeny({
                            denySeq: data.denySeq,
                            callback: ({ header, body }) => {
                                if (header.success && body) {
                                    toast.success(header.message);
                                } else {
                                    messageBox.alert(header.message);
                                }
                            },
                        }),
                    );
                },
                () => {},
            );
        },
        [dispatch],
    );

    useEffect(() => {
        dispatch(getTourDenyList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (holidayList.length > 0) {
            setRowData(
                holidayList.map((data) => {
                    return {
                        ...data,
                        denyDate: moment(data.denyDate).format('YYYY-MM-DD'),
                        onModify: handleClickModify,
                        onDelete: handleClickDelete,
                    };
                }),
            );
        } else {
            setRowData([]);
        }
    }, [holidayList, handleClickModify, handleClickDelete]);

    return (
        <MokaCard
            width={790}
            className="mr-gutter"
            bodyClassName="d-flex flex-column"
            title="휴일 지정(매년 반복)"
            titleButtons={[
                {
                    text: '휴일 등록',
                    variant: 'positive',
                    onClick: handleClickAdd,
                },
            ]}
        >
            <MokaTable
                className="flex-fill overflow-hidden"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={GRID_ROW_HEIGHT.C[0]}
                onRowNodeId={(data) => data.denySeq}
                loading={loading}
                paging={false}
                pageSizes={false}
                showTotalString={false}
                preventRowClickCell={['editButton']}
                refreshCellsParams={{
                    force: true,
                }}
            />
            <HolidayRegistrationModal show={show} onHide={() => setShow(false)} data={modalData} />
        </MokaCard>
    );
};

export default HolidayAgGrid;
