package jmnet.moka.core.tps.mvc.member.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.group.repository.GroupMemberRepository;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.LoginLog;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.entity.MemberSms;
import jmnet.moka.core.tps.mvc.member.repository.LoginLogRepository;
import jmnet.moka.core.tps.mvc.member.repository.MemberRepository;
import jmnet.moka.core.tps.mvc.member.repository.MemberSmsRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final MemberSmsRepository memberSmsRepository;

    private final GroupMemberRepository groupMemberRepository;

    private final LoginLogRepository loginLogRepository;

    public MemberServiceImpl(MemberRepository memberRepository, MemberSmsRepository memberSmsRepository, GroupMemberRepository groupMemberRepository,
            LoginLogRepository loginLogRepository) {
        this.memberRepository = memberRepository;
        this.memberSmsRepository = memberSmsRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.loginLogRepository = loginLogRepository;
    }

    @Override
    public Page<MemberInfo> findAllMember(MemberSearchDTO search) {
        return memberRepository.findAllMember(search);
    }

    @Override
    public List<MemberInfo> findAllMember() {
        return memberRepository.findAll();
    }

    @Override
    public Optional<MemberSms> findFirstByMemberIdOrderByRegDtDesc(String memberId) {
        return memberSmsRepository.findFirstByMemberIdOrderByRegDtDesc(memberId);
    }

    @Override
    public Optional<MemberInfo> findMemberById(String memberId) {
        return findMemberById(memberId, false);
    }

    @Override
    public Optional<MemberInfo> findMemberById(String memberId, boolean isGroupAll) {
        memberRepository
                .findByMemberId(memberId)
                .ifPresent(memberInfo1 -> {
                    memberInfo1.setGroupMembers(
                            isGroupAll ? groupMemberRepository.findAllByMemberId(memberId) : groupMemberRepository.findAllByMemberId(memberId));
                });
        return memberRepository.findByMemberId(memberId);
    }

    @Override
    public MemberSms insertMemberSms(MemberSms memberSms) {
        return memberSmsRepository.save(memberSms);
    }

    @Override
    public MemberInfo insertMember(MemberInfo member) {
        return memberRepository.save(member);
    }

    @Override
    public MemberInfo updateMember(MemberInfo member) {
        return memberRepository.save(member);
    }

    @Override
    public MemberInfo updateMemberStatus(String memberId, MemberStatusCode status) {
        Optional<MemberInfo> optionalMember = this.findMemberById(memberId);
        MemberInfo member = null;
        if (optionalMember.isPresent()) {
            member = optionalMember.get();
            member.setStatus(status);
            member = updateMember(member);
        }
        return member;
    }

    @Override
    public MemberInfo updateMemberStatus(String memberId, MemberStatusCode status, Integer errorCnt, String remark) {
        Optional<MemberInfo> optionalMember = this.findMemberById(memberId);
        MemberInfo member = null;
        if (optionalMember.isPresent()) {
            member = optionalMember.get();
            member.setStatus(status);
            if (errorCnt > -1) {
                member.setErrCnt(errorCnt);
            }
            if (McpString.isNotEmpty(member.getRemark())) {
                member.setRemark(member.getRemark() + "\n" + remark);
            } else {
                member.setRemark(remark);
            }
            member = updateMember(member);
        }
        return member;
    }

    @Override
    public MemberInfo updateMemberStatus(String memberId, MemberStatusCode status, String remark) {
        return updateMemberStatus(memberId, status, -1, remark);
    }

    @Override
    public MemberInfo updateMemberLoginInfo(String memberId, Date loginDate, String loginIp) {
        return updateMemberLoginInfo(memberId, loginDate, loginIp, null);
    }


    @Override
    public MemberInfo updateMemberLoginInfo(String memberId, Date loginDate, String loginIp, UserDTO userDTO) {
        Optional<MemberInfo> optionalMember = this.findMemberById(memberId);
        return optionalMember
                .map(value -> {
                    value.setLastLoginDt(loginDate);
                    value.setLastLoginIp(loginIp);
                    value.setErrCnt(0);
                    if (userDTO != null) {
                        value.setCompanyPhone(userDTO.getPhoneNo());
                        value.setMemberNm(userDTO.getUserName());
                        value.setMobilePhone(userDTO.getCellPhoneNo());
                        value.setDept(userDTO.getDept());
                        value.setEmail(userDTO.getEmailaddress());
                        value.setMemberId(value.getMemberId());
                        if (userDTO.getExpireDt() != null) {
                            value.setExpireDt(userDTO.getExpireDt());
                        }
                    }
                    return updateMember(value);
                })
                .orElse(null);
    }



    @Override
    public MemberInfo updateMemberLoginErrorCount(String memberId, Integer errorCnt) {
        Optional<MemberInfo> optionalMember = this.findMemberById(memberId);
        MemberInfo member = null;
        if (optionalMember.isPresent()) {
            member = optionalMember.get();
            member.setErrCnt(errorCnt);
            member = updateMember(member);
        }
        return member;
    }

    @Override
    public MemberInfo addMemberLoginErrorCount(String memberId) {
        Optional<MemberInfo> optionalMember = this.findMemberById(memberId);
        return optionalMember
                .map(this::addMemberLoginErrorCount)
                .orElse(null);
    }

    @Override
    public MemberInfo addMemberLoginErrorCount(MemberInfo member) {
        MemberInfo entity = member;
        entity.setErrCnt(member.getErrCnt() + 1);
        entity = updateMember(entity);
        return entity;
    }

    @Override
    @Transactional
    public void deleteMember(MemberInfo member) {
        if (member.getGroupMembers() == null) {
            List<GroupMember> groupMembers = this.findGroupMemberList(member.getMemberId());
            member.setGroupMembers((groupMembers != null ? new ArrayList<>(groupMembers) : new ArrayList<>()));
        }

        member
                .getGroupMembers()
                .forEach(this::deleteGroupMember);
        memberRepository.delete(member);
    }

    @Override
    public void deleteMemberById(String memberId) {
        this
                .findMemberById(memberId)
                .ifPresent(this::deleteMember);
    }

    @Override
    public boolean isDuplicatedId(String memberId) {
        Optional<MemberInfo> existingMember = this.findMemberById(memberId);
        return existingMember.isPresent();
    }

    @Override
    public GroupMember insertGroupMember(GroupMember groupMember) {
        return groupMemberRepository.save(groupMember);
    }

    @Override
    public GroupMember updateGroupMember(GroupMember groupMember) {
        return groupMemberRepository.save(groupMember);
    }

    @Override
    public void deleteGroupMember(GroupMember groupMember) {
        groupMemberRepository.delete(groupMember);
    }

    @Override
    public void deleteGroupMember(Long seqNo) {
        groupMemberRepository.deleteById(seqNo);
    }

    public List<GroupMember> findGroupMemberList(String memberId) {
        return groupMemberRepository.findAllByMemberId(memberId);
    }

    @Override
    public LoginLog insertLoginLog(LoginLog log) {
        return loginLogRepository.save(log);
    }

    @Override
    public List<LoginLog> findAllLoginLog(String memberId) {
        return loginLogRepository.findAllByMemId(memberId);
    }

    @Override
    public Page<LoginLog> findAllLoginLog(String memberId, SearchDTO memberSearchDTO) {
        return loginLogRepository.findAllByMemIdOrderBySeqNoDesc(memberId, memberSearchDTO.getPageable());
    }
}
