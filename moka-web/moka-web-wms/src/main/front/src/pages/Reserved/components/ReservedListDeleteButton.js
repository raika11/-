import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteReserved } from '~/stores/reserved/reservedStore';
import { WmsIconButton, WmsMessageBox } from '~/components';

const ReservedListDeleteButton = ({ row, history }) => {
    const dispatch = useDispatch();

    // 도메인 삭제
    const onClick = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const reservedSet = {
                domainId: row.domain.domainId,
                seq: row.reservedSeq
            };
            if (row.id) {
                const message = `[${row.id}_${row.reservedId}]를 삭제하시겠습니까?`;
                WmsMessageBox.confirm(message, () => {
                    dispatch(
                        deleteReserved({ callback: () => history.push('/reserved'), reservedSet })
                    );
                });
            }
        },
        [history, row, dispatch]
    );

    return <WmsIconButton icon="remove_circle" onClick={onClick} />;
};

export default withRouter(ReservedListDeleteButton);
