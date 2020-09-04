import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { changeListType } from '~/stores/template/templateStore';
import { WmsButton, WmsToggleButton } from '~/components';

const TemplateTableButton = (props) => {
    const { classes } = props;
    let history = useHistory();
    const dispatch = useDispatch();
    const { listType } = useSelector(({ templateStore }) => ({
        listType: templateStore.listType
    }));

    /**
     * 템플릿추가 클릭 콜백
     */
    const onAddClick = () => {
        history.push('/template');
    };

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
        <>
            <div>
                <ToggleButtonGroup
                    size="small"
                    value={listType}
                    exclusive
                    onChange={handleListTypeChange}
                >
                    <WmsToggleButton
                        square
                        disableRipple
                        icon="view_list"
                        value="list"
                        aria-label="list"
                    />
                    <WmsToggleButton
                        square
                        disableRipple
                        icon="view_module"
                        value="thumbnail"
                        aria-label="thumbnail"
                    />
                </ToggleButtonGroup>
            </div>
            <div>
                <WmsButton color="wolf" onClick={onAddClick}>
                    <span>템플릿 추가</span>
                </WmsButton>
            </div>
        </>
    );
};

export default TemplateTableButton;
