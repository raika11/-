import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { GET_GROUP_MENU_AUTH, changeGroupMenuAuth, getGroupMenuAuth, updateGroupMenuAuth, UPDATE_GROUP_MENU_AUTH } from '@store/group';
import toastUtil from '@utils/toastUtil';
import MenuAuthTree from '@pages/Menu/component/MenuAuthTree';
import { Col, Row } from 'react-bootstrap';
import { MokaCard } from '@components';
import { useParams } from 'react-router-dom';
import commonUtil from '@utils/commonUtil';

const GroupChildMenuAuth = () => {
    const { groupCd: paramCd } = useParams();
    const { menuAuthInfo, groupCd, loading } = useSelector(
        (store) => {
            return {
                menuAuthInfo: store.group.menuAuthInfo,
                groupCd: store.group.group.groupCd,
                loading: store.loading[GET_GROUP_MENU_AUTH] || store.loading[UPDATE_GROUP_MENU_AUTH],
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
        console.log(paramCd);
        dispatch(getGroupMenuAuth(groupCd));
    };

    const handleChange = (changeInfo) => {
        dispatch(changeGroupMenuAuth(changeInfo));
    };

    const makeFooterButtons = () => {
        let footerButtons = [];
        if (!commonUtil.isEmpty(paramCd)) {
            footerButtons = [
                { text: '저장', variant: 'positive', onClick: handleClickSave, className: 'mr-1' },
                { text: '새로고침', variant: 'negative', onClick: handleClickCancel },
            ];
        }
        return footerButtons;
    };

    return (
        <MokaCard
            titleAs={
                <>
                    <h2 className="mb-0">메뉴권한</h2>
                    <Row className="rc-tree-header" style={{ marginTop: '20px' }}>
                        <Col xs={6} style={{ fontWeight: '700', paddingLeft: '40px' }}>
                            메뉴명
                        </Col>
                        <Col xs={3} style={{ fontWeight: '700', textAlign: 'right' }}>
                            조회권한
                        </Col>
                        <Col xs={3} style={{ fontWeight: '700', textAlign: 'right' }}>
                            수정권한
                        </Col>
                    </Row>
                </>
            }
            headerClassName="rc-tree-card-header"
            bodyClassName="rc-tree-card-body group"
            className="w-100 shadow-none"
            loading={loading}
            footerClassName="justify-content-center"
            footerButtons={makeFooterButtons()}
            footer
        >
            <Row style={{ padding: '0 20px 0 20px' }} className="rc-tree-group">
                <MenuAuthTree menuAuthInfo={menuAuthInfo} onChange={handleChange} />
            </Row>
        </MokaCard>
    );
};

export default GroupChildMenuAuth;
