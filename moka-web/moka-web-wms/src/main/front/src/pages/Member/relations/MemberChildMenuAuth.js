import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import toastUtil from '@utils/toastUtil';
import { MokaCard } from '@components';
import { Button, Row } from 'react-bootstrap';
import MenuAuthTree from '@pages/Menu/component/MenuAuthTree';
import { changeMemberMenuAuth, getMemberMenuAuth, updateMemberMenuAuth } from '@store/member';

const MemberChildMenuAuth = () => {
    const { menuAuthInfo, memberId } = useSelector(
        (store) => {
            return {
                menuAuthInfo: store.member.menuAuthInfo,
                memberId: store.member.member.memberId,
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
            updateMemberMenuAuth({
                memberId,
                changeMenuAuthList,
                callback: (response) => {
                    if (response.body) {
                        dispatch(getMemberMenuAuth(memberId));
                    }
                    toastUtil.result(response);
                },
            }),
        );
    };

    const handleClickCancel = () => {
        dispatch(getMemberMenuAuth(memberId));
    };

    const handleChange = (changeInfo) => {
        dispatch(changeMemberMenuAuth(changeInfo));
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

export default MemberChildMenuAuth;
