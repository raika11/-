import React, { useCallback, useEffect, useState, Suspense } from 'react';
import GroupChildGroupMemberList from '@pages/Group/relations/GroupChildGroupMemberList';
import GroupChildSearchMemberList from '@pages/Group/relations/GroupChildSearchMemberList';
import { MokaCard } from '@components';
import { Col, Row } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import GroupChildGroupMemberHeader from '@pages/Group/relations/GroupChildGroupMemberHeader';
import GroupChildSearchMemberHeader from '@pages/Group/relations/GroupChildSearchMemberHeader';
import { changeMemberSearchOption, getGroupInMemberList, getSearchMemberList, updateGroupInMember } from '@store/group';
import toast, { messageBox } from '@utils/toastUtil';

import * as action from '@store/group/groupAction';

const GroupChildGroupMemberEdit = () => {
    const [updateData, setUpdateData] = useState({
        add: [],
        delete: [],
    });
    const { groupCd, groupIn, groupOut } = useSelector(({ group, loading }) => {
        return {
            groupCd: group.group.groupCd,
            groupIn: {
                list: group.member.groupIn.list,
                total: group.member.groupIn.total,
                loading: loading[action.GET_GROUP_IN_MEMBER_LIST],
            },
            groupOut: {
                list: group.member.groupOut.list,
                total: group.member.groupOut.total,
                search: group.member.groupOut.search,
                loading: loading[action.GET_SEARCH_MEMBER_LIST],
            },
        };
    }, shallowEqual);

    const dispatch = useDispatch();

    const handleSearch = (data) => {
        console.log(data);
        dispatch(changeMemberSearchOption({ name: 'searchType', value: data.searchType }));
        dispatch(changeMemberSearchOption({ name: 'keyword', value: data.keyword }));
    };

    const handleChangeSearchOption = useCallback(
        ({ name, value }) => {
            dispatch(changeMemberSearchOption({ name, value }));
        },
        [dispatch],
    );
    const handleClickGroupMemberDelete = () => {
        if (updateData.delete.length > 0) {
            const useYn = 'N';
            const memberIds = updateData.delete.join(',');
            dispatch(
                updateGroupInMember({
                    groupCd,
                    memberIds,
                    useYn,
                    callback: (response) => {
                        if (response.body) {
                            dispatch(getGroupInMemberList({ search: { groupCd, useTotal: 'N' } }));
                        }
                        toast.result(response);
                    },
                }),
            );
        } else {
            toast.warning('선택된 사용자가 없습니다.');
        }
    };
    const handleClickGroupMemberAdd = () => {
        if (updateData.add.length > 0) {
            const hasMemberList = groupIn.list.filter((member) => updateData.add.includes(member.memberId));
            if (hasMemberList.length > 0) {
                const hasMemberIds = hasMemberList.map((member) => member.memberId);
                toast.warning(`그룹에 등록된 아이디가 존재합니다.\n(${hasMemberIds.join(',')})`);
            } else {
                const useYn = 'Y';
                const memberIds = updateData.add.join(',');
                dispatch(
                    updateGroupInMember({
                        groupCd,
                        memberIds,
                        useYn,
                        callback: (response) => {
                            if (response.body) {
                                dispatch(getGroupInMemberList({ search: { groupCd, useTotal: 'N' } }));
                            }
                            toast.result(response);
                        },
                    }),
                );
            }
        } else {
            toast.warning('선택된 사용자가 없습니다.');
        }
    };

    const handleSelectMembers = (selectedNodes, name) => {
        const memberIds = selectedNodes.map((node) => node.data.memberId);
        setUpdateData({ ...updateData, [name]: memberIds });
    };

    useEffect(() => {
        if (groupCd) {
            const search = { ...groupOut.search, page: 0 };
            dispatch(getSearchMemberList({ search }));
        }
    }, [dispatch, groupCd, groupOut.search]);

    useEffect(() => {
        dispatch(getGroupInMemberList({ search: { groupCd, useTotal: 'N' } }));
    }, [dispatch, groupCd]);

    return (
        <MokaCard title="사용자 목록" width={1000}>
            <Row>
                <Col xs={6}>
                    <GroupChildGroupMemberHeader onClick={handleClickGroupMemberDelete} />
                    <GroupChildGroupMemberList
                        list={groupIn.list}
                        paging={false}
                        onSelect={(selectedNodes) => {
                            handleSelectMembers(selectedNodes, 'delete');
                        }}
                        loading={groupIn.loading}
                    />
                </Col>
                <Col xs={6}>
                    <Suspense>
                        <GroupChildSearchMemberHeader onSearch={handleSearch} onChange={handleChangeSearchOption} onClick={handleClickGroupMemberAdd} />
                        <GroupChildSearchMemberList
                            list={groupOut.list}
                            total={groupOut.total}
                            page={groupOut.search.page}
                            size={groupOut.search.size}
                            paging={true}
                            loading={groupOut.loading}
                            onChangeSearchOption={handleChangeSearchOption}
                            onSelect={(selectedNodes) => {
                                handleSelectMembers(selectedNodes, 'add');
                            }}
                        />
                    </Suspense>
                </Col>
            </Row>
        </MokaCard>
    );
};

export default GroupChildGroupMemberEdit;
