import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { GET_GROUP_MENU_AUTH, changeGroupMenuAuth, getGroupMenuAuth, updateGroupMenuAuth, UPDATE_GROUP_MENU_AUTH } from '@store/group';
import toastUtil from '@utils/toastUtil';
import MenuAuthTree from '@pages/Menu/component/MenuAuthTree';
import { Col, Row } from 'react-bootstrap';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

const GroupChildMenuAuth = () => {
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
        dispatch(getGroupMenuAuth(groupCd));
    };

    const handleChange = (changeInfo) => {
        dispatch(changeGroupMenuAuth(changeInfo));
    };

    return (
        <MokaCard
            titleAs={
                <>
                    메뉴권한
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
            className="w-100"
            height={CARD_DEFAULT_HEIGHT - 90}
            loading={loading}
            footerClassName="justify-content-center"
            footerButtons={
                groupCd && [
                    { text: '저장', variant: 'positive', onClick: handleClickSave, className: 'float-left mr-10 pr-20 pl-20' },
                    { text: '취소', variant: 'negative', onClick: handleClickCancel, className: 'float-left mr-0 pr-20 pl-20' },
                ]
            }
            footer
        >
            <Row style={{ padding: '0 20px 0 20px' }} className="rc-tree-group">
                <MenuAuthTree menuAuthInfo={menuAuthInfo} onChange={handleChange} />
            </Row>
            {/*{groupCd && (
                <Row className="d-flex pt-20 justify-content-center">
                    <Button variant="positive" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button variant="gray150" className="float-left mr-0 pr-20 pl-20" onClick={handleClickCancel}>
                        취소
                    </Button>
                </Row>
            )}*/}
        </MokaCard>
    );
};

export default GroupChildMenuAuth;
