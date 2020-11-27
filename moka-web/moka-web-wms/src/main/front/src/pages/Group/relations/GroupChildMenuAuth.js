import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeGroupMenuAuth, getGroupMenuAuth, updateGroupMenuAuth } from '@store/group';
import toastUtil from '@utils/toastUtil';
import MenuAuthTree from '@pages/Menu/component/MenuAuthTree';
import { Button, Row } from 'react-bootstrap';
import { MokaCard } from '@components';

const GroupChildMenuAuth = () => {
    const { menuAuthInfo, groupCd } = useSelector(
        (store) => {
            return {
                menuAuthInfo: store.group.menuAuthInfo,
                groupCd: store.group.group.groupCd,
            };
        },

        shallowEqual,
    );
    const dispatch = useDispatch();

    const handleClickSave = () => {
        const edited = menuAuthInfo.edited;
        const used = [...menuAuthInfo.used, ...menuAuthInfo.halfCheckedKeys];

        let changeMenuAuthList = [];
        for (const menuId of used) {
            const usedYn = 'Y';
            const editYn = edited.includes(menuId) ? 'Y' : 'N';
            const viewYn = 'Y';

            changeMenuAuthList = [...changeMenuAuthList, { menuId, usedYn, editYn, viewYn }];
        }

        dispatch(
            updateGroupMenuAuth({
                groupCd,
                changeMenuAuthList,
                callback: (response) => {
                    if (response.body) {
                        dispatch(getGroupMenuAuth(groupCd));
                    }
                    toastUtil.result(response);
                },
            }),
        );
    };

    const handleClickCancel = () => {
        dispatch(getGroupMenuAuth(groupCd));
    };

    const handleChange = (changeInfo) => {
        dispatch(changeGroupMenuAuth(changeInfo));
    };

    return (
        <MokaCard title="메뉴 권한">
            <Row>
                <MenuAuthTree menuAuthInfo={menuAuthInfo} onChange={handleChange} />
            </Row>
            <Row className="d-flex pt-20 justify-content-center">
                <Button variant="positive" onClick={handleClickSave}>
                    저장
                </Button>
                <Button variant="gray150" onClick={handleClickCancel}>
                    취소
                </Button>
            </Row>
        </MokaCard>
    );
};

export default GroupChildMenuAuth;
