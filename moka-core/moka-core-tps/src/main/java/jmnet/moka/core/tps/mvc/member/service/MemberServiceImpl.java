package jmnet.moka.core.tps.mvc.member.service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import jmnet.moka.core.tps.mvc.member.repository.GroupMemberRepository;
import jmnet.moka.core.tps.mvc.member.repository.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    private final GroupMemberRepository groupMemberRepository;

    public MemberServiceImpl(MemberRepository memberRepository, GroupMemberRepository groupMemberRepository) {
        this.memberRepository = memberRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Override
    public Page<Member> findMemberList(SearchDTO search) {
        return memberRepository.findAll(search.getPageable());
    }

    @Override
    public List<Member> findMemberList() {
        return memberRepository.findAll();
    }

    @Override
    public Optional<Member> findMemberById(String memberId) {
        return memberRepository.findByMemberId(memberId);
    }

    @Override
    public Member insertMember(Member member) {
        return memberRepository.save(member);
    }

    @Override
    public Member updateMember(Member member) {
        return memberRepository.save(member);
    }

    @Override
    public Member updateMemberStatus(String memberId, String status) {
        Optional<Member> optionalMember = this.findMemberById(memberId);
        Member member = null;
        if (optionalMember.isPresent()) {
            member = optionalMember.get();
            member.setStatus(status);
            member = updateMember(member);
        }
        return member;
    }

    @Override
    public Member updateMemberLoginInfo(String memberId, Date loginDate, String loginIp) {
        return updateMemberLoginInfo(memberId, loginDate, loginIp, null);
    }

    @Override
    public Member updateMemberLoginInfo(String memberId, Date loginDate, String loginIp, Date expireDt) {
        Optional<Member> optionalMember = this.findMemberById(memberId);
        return optionalMember.map(value -> updateMemberLoginInfo(value, loginDate, loginIp, null))
                             .orElse(null);
    }

    @Override
    public Member updateMemberLoginInfo(Member member, Date loginDate, String loginIp) {
        return updateMemberLoginInfo(member, loginDate, loginIp, null);
    }

    @Override
    public Member updateMemberLoginInfo(Member member, Date loginDate, String loginIp, Date expireDt) {
        member.setLastLoginDt(loginDate);
        member.setLastLoginIp(loginIp);
        if (expireDt != null) {
            member.setExpireDt(expireDt);
        }
        return updateMember(member);
    }

    @Override
    public Member updateMemberLoginErrorCount(String memberId, Integer errorCnt) {
        Optional<Member> optionalMember = this.findMemberById(memberId);
        Member member = null;
        if (optionalMember.isPresent()) {
            member = optionalMember.get();
            member.setErrCnt(errorCnt);
            member = updateMember(member);
        }
        return member;
    }

    @Override
    public Member addMemberLoginErrorCount(String memberId) {
        Optional<Member> optionalMember = this.findMemberById(memberId);
        return optionalMember.map(this::addMemberLoginErrorCount)
                             .orElse(null);
    }

    @Override
    public Member addMemberLoginErrorCount(Member member) {
        Member entity = member;
        entity.setErrCnt(member.getErrCnt() + 1);
        entity = updateMember(entity);
        return entity;
    }

    @Override
    @Transactional
    public void deleteMember(Member member) {
        if (member.getGroupMembers() == null) {
            List<GroupMember> groupMembers = this.findGroupMemberList(member.getMemberId());
            member.setGroupMembers((groupMembers != null ? new HashSet<>(groupMembers) : new HashSet<>()));
        }

        member.getGroupMembers()
              .forEach(groupMember -> {
                  this.deleteGroupMember(groupMember);
              });
        memberRepository.delete(member);
    }

    @Override
    public void deleteMemberById(String memberId) {
        this.findMemberById(memberId)
            .ifPresent(member -> {
                deleteMember(member);
            });
    }

    @Override
    public boolean isDuplicatedId(String memberId) {
        Optional<Member> existingMember = this.findMemberById(memberId);
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
}
