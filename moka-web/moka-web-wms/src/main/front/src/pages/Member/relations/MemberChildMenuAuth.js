import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import toastUtil, { messageBox } from '@utils/toastUtil';
import { MokaCard } from '@components';
import { Col, Row } from 'react-bootstrap';
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
        const halfCheckedKeys = menuAuthInfo.halfCheckedKeys;
        const used = [...menuAuthInfo.used, ...halfCheckedKeys];
        const edited = menuAuthInfo.edited;

        const editedOrg = menuAuthInfo.editedOrg;
        const usedOrg = menuAuthInfo.usedOrg;

        const editedChanged = edited.filter((menuId) => !editedOrg.includes(menuId)).concat(editedOrg.filter((menuId) => !edited.includes(menuId)));
        //[...edited.filter((menuId) => !editedOrg.includes(menuId)), ...editedOrg.filter((menuId) => !edited.includes(menuId))];
        const usedChanged = used.filter((menuId) => !usedOrg.includes(menuId)).concat(usedOrg.filter((menuId) => !used.includes(menuId)));
        //[...used.filter((menuId) => !usedOrg.includes(menuId)), ...usedOrg.filter((menuId) => !used.includes(menuId))];
        const changeMenuAuthList = nodeList(menuAuthInfo.list).filter((info) => {
            return usedChanged.includes(info.menuId) || editedChanged.includes(info.menuId);
        });

        if (changeMenuAuthList.length > 0) {
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
        } else {
            messageBox.alert('????????? ?????? ????????? ????????????.');
        }

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
            titleAs={
                <>
                    <h2 className="card-title">????????????</h2>
                    <Row className="rc-tree-header" style={{ marginTop: '20px' }}>
                        <Col xs={6} style={{ fontWeight: '700', paddingLeft: '40px' }}>
                            ?????????
                        </Col>
                        <Col xs={3} style={{ fontWeight: '700', textAlign: 'right' }}>
                            ????????????
                        </Col>
                        <Col xs={3} style={{ fontWeight: '700', textAlign: 'right' }}>
                            ????????????
                        </Col>
                    </Row>
                </>
            }
            headerClassName="rc-tree-card-header"
            bodyClassName="rc-tree-card-body member"
            className="w-100"
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '??????', variant: 'positive', onClick: handleClickSave, className: 'mr-1' },
                { text: '????????????', variant: 'negative', onClick: handleClickCancel },
            ]}
            footer
        >
            <Row style={{ padding: '0 20px 0 20px' }}>
                <MenuAuthTree menuAuthInfo={menuAuthInfo} onChange={handleChange} />
            </Row>
        </MokaCard>
    );
};

export default MemberChildMenuAuth;
