import React, { useState, useEffect } from 'react';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import Form from 'react-bootstrap/Form';
import { DB_DATEFORMAT } from '@/constants';
import toast, { messageBox } from '@/utils/toastUtil';
import { clearMember, getMember, changeInvalidList, changeMember, saveMember, GET_MEMBER, SAVE_MEMBER, getMemberMenuAuth, clearMemberMenuAuth } from '@store/member';
import { MokaInputLabel } from '@components';
import commonUtil from '@utils/commonUtil';

/**
 * 사용자 상세/수정
 * @param history rect-router-dom useHisotry
 */
const MemberEdit = ({ match }) => {
    const { memberId: paramId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const [status, setStatus] = useState('');
    const [memberId, setMemberId] = useState('');
    const [expireDt, setExpireDt] = useState('');
    const [remark, setRemark] = useState('');
    const [tmpExpireDt, setTmpExpireDt] = useState('');
    const [expireDtError, setExpireDtError] = useState(false);
    const [remarkError, setRemarkError] = useState(false);
    const [statusError, setStatusError] = useState(false);

    const [memberGroupInfo, setMemberGroupInfo] = useState('');

    const { member, loading, statusList, invalidList } = useSelector(
        (store) => ({
            member: store.member.member,
            loading: store.loading[GET_MEMBER] || store.loading[SAVE_MEMBER],
            invalidList: store.member.invalidList,
            statusList: store.app.MEMBER_STATUS_CODE,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (paramId) {
            dispatch(getMember(paramId));
            dispatch(getMemberMenuAuth(paramId));
        } else {
            dispatch(clearMember());
            dispatch(clearMemberMenuAuth());
        }
    }, [dispatch, paramId]);

    useEffect(() => {
        // 메뉴 데이터 셋팅
        const groupMembers = member.groupMembers;
        setMemberId(member.memberId || '');
        setStatus(member.status || '');
        setExpireDt(member.expireDt || '');
        setTmpExpireDt(member.expireDt || '');
        setRemark(member.remark || '');

        let groupInfo = '';
        if (!commonUtil.isEmpty(groupMembers) && groupMembers instanceof Array) {
            console.log(groupMembers);
            groupInfo = groupMembers.map((groupInfo) => `${groupInfo.group.groupKorNm}(${groupInfo.group.groupCd})`).join(', ');
        }
        setMemberGroupInfo(groupInfo);
    }, [member]);

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        if (name === 'status') {
            setStatus(value);
            setStatusError(false);
        } else if (name === 'remark') {
            setRemark(value);
            setRemarkError(false);
        }
    };

    const handleExpireDt = (date) => {
        const dateTime = moment(date).format(DB_DATEFORMAT);
        if (typeof date === 'object') {
            setExpireDt(dateTime);
            setTmpExpireDt(dateTime);
        } else {
            setTmpExpireDt('');
        }
        setExpireDtError(false);
    };

    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const menuItem = {
            memberId,
            status,
            remark,
            expireDt: tmpExpireDt,
        };

        if (validate(menuItem)) {
            if (member.memberId) {
                updateMember(menuItem);
            }
        }
    };

    const validate = (memberItem) => {
        let isInvalid = false;
        let errList = [];
        if (
            memberItem.expireDt !== '' &&
            !/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])\s([1-9]|[01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(memberItem.expireDt)
        ) {
            errList.push({
                field: 'expireDt',
                reason: '만료일시가 올바르지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }
        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    useEffect(() => {
        if (invalidList && invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'expireDt') {
                    setExpireDtError(true);
                }
                if (i.field === 'status') {
                    setStatusError(true);
                }
                if (i.field === 'remark') {
                    setRemarkError(true);
                }
            });
            messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
        } else {
            setExpireDtError(false);
            setStatusError(false);
            setRemarkError(false);
        }
    }, [invalidList]);

    const updateMember = (menuItem) => {
        dispatch(
            saveMember({
                type: 'update',
                actions: [
                    changeMember({
                        ...member,
                        ...menuItem,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        toast.success(response.header.message);
                    } else {
                        const { body } = response;
                        dispatch(changeInvalidList(body.list));
                        toast.error(response.header.message);
                    }
                },
            }),
        );
    };

    const handleClickCancel = () => {
        history.push(`${match.path}`);
        dispatch(clearMember());
        dispatch(clearMemberMenuAuth());
    };

    return (
        <MokaCard
            className="w-100"
            title="사용자 정보"
            loading={loading}
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '수정', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
        >
            <Form>
                <MokaInputLabel className="mb-2" label="ID" name="memberId" value={member.memberId} inputProps={{ plaintext: true, readOnly: true }} />
                {/* 이름 */}
                <MokaInputLabel className="mb-2" label="이름" value={member.memberNm} name="memberNm" inputProps={{ plaintext: true, readOnly: true }} />
                {/* Email */}
                <MokaInputLabel className="mb-2" label="Email" value={member.email} name="email" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 휴대전화 */}
                <MokaInputLabel className="mb-2" label="휴대전화" value={member.mobilePhone} name="mobilePhone" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 소속 */}
                <MokaInputLabel className="mb-2" label="소속" value={member.dept} name="dept" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 그룹 */}
                <MokaInputLabel className="mb-2" label="그룹" value={memberGroupInfo} name="dept" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 상태 */}
                <MokaInputLabel
                    as="select"
                    className="mb-2"
                    label="상태"
                    name="status"
                    value={status}
                    onChange={handleChangeValue}
                    isInvalid={statusError}
                    disabled={member.memberId ? false : true}
                >
                    {statusList.map((status) => (
                        <option key={status.code} value={status.code}>
                            {status.name}
                        </option>
                    ))}
                </MokaInputLabel>
                {/* 메모 */}
                <MokaInputLabel
                    as="textarea"
                    className="mb-2"
                    label="비고"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    name="remark"
                    value={remark}
                    onChange={handleChangeValue}
                    isInvalid={remarkError}
                    disabled={member.memberId ? false : true}
                />
                {/* 만료일시 */}
                <MokaInputLabel
                    as="dateTimePicker"
                    className="mb-2"
                    label="만료일시"
                    inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm:ss' }}
                    name="expireDt"
                    value={expireDt}
                    onChange={handleExpireDt}
                    isInvalid={expireDtError}
                    disabled={member.memberId ? false : true}
                />
                {/* 등록일시 */}
                <MokaInputLabel className="mb-2" label="등록일시" value={member.regDt} name="regDt" inputProps={{ plaintext: true, readOnly: true }} />
                {/* 최종 접속일시 */}
                <MokaInputLabel className="mb-2" label="최종\n접속일시" value={member.lastLoginDt} name="dept" inputProps={{ plaintext: true, readOnly: true }} />
            </Form>
        </MokaCard>
    );
};

export default withRouter(MemberEdit);
