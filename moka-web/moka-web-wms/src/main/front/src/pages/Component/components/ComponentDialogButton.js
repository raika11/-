import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { changeListType } from '~/stores/template/templateStore';
import { WmsToggleButton } from '~/components';

const ComponentDialogButton = () => {
    const dispatch = useDispatch();
    const { listType } = useSelector(({ templateStore }) => ({
        listType: templateStore.listType
    }));

    /**
     * 리스트타입 변경
     */
    const handleListTypeChange = useCallback(
        (event, nextListType) => {
            if (nextListType !== null) {
                dispatch(changeListType(nextListType));
            }
        },
        [dispatch]
    );

    return (
        <ToggleButtonGroup size="small" value={listType} exclusive onChange={handleListTypeChange}>
            <WmsToggleButton square disableRipple icon="view_list" value="list" aria-label="list" />
            <WmsToggleButton
                square
                disableRipple
                icon="view_module"
                value="thumbnail"
                aria-label="thumbnail"
            />
        </ToggleButtonGroup>
    );
};

export default ComponentDialogButton;
