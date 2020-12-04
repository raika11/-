import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import toastUtil from '@utils/toastUtil';
import { MokaCard } from '@components';
import { Row } from 'react-bootstrap';
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

        /*let changeMenuAuthList = [];
        for (const menuId of used) {
            const usedYn = 'Y';
            const editYn = edited.includes(menuId) ? 'Y' : 'N';
            const viewYn = 'Y';

            changeMenuAuthList = [...changeMenuAuthList, { menuId, usedYn, editYn, viewYn }];
        }*/

        const changeMenuAuthList = nodeList(menuAuthInfo.list);
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

        function nodeList(menuAuthInfos) {
            let infos = [];
            for (const info of menuAuthInfos) {
                const menuId = info.key;
                const usedYn = used.includes(menuId) ? 'Y' : 'N';
                const editYn = usedYn === 'Y' && edited.includes(menuId) ? 'Y' : 'N';

                infos.push({ menuId, usedYn, editYn });
                const children = info.children;
                if (children) {
                    infos = [...infos, ...nodeList(children)];
                }
            }

            return infos;
        }
    };

    const handleClickCancel = () => {
        dispatch(getMemberMenuAuth(memberId));
    };

    const handleChange = (changeInfo) => {
        dispatch(changeMemberMenuAuth(changeInfo));
    };

    return (
        <MokaCard
            title="메뉴 권한"
            className="w-100"
            footerClassName="justify-content-center"
            footerButtons={
                memberId && [
                    { text: '저장', variant: 'positive', onClick: handleClickSave, className: 'float-left mr-10 pr-20 pl-20' },
                    { text: '취소', variant: 'negative', onClick: handleClickCancel, className: 'float-left mr-0 pr-20 pl-20' },
                ]
            }
            footer
        >
            <Row style={{ padding: '0 20px 0 20px' }}>
                <MenuAuthTree menuAuthInfo={menuAuthInfo} onChange={handleChange} />
            </Row>
        </MokaCard>
    );
};

export default MemberChildMenuAuth;
