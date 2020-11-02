package jmnet.moka.core.tps.mvc.member.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import org.springframework.data.domain.Page;

public interface MemberService {
    /**
     * 멤버 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과 목록
     */
    Page<Member> findAllMember(MemberSearchDTO search);

    /**
     * 전체 멤버 조회
     *
     * @return 멤버 목록
     */
    List<Member> findAllMember();

    /**
     * 멤버 ID로 멤버 상세 조회
     *
     * @param memberId 멤버 ID
     * @return
     */
    Optional<Member> findMemberById(String memberId);

    /**
     * 멤버 등록
     *
     * @param member 멤버 정보
     * @return 멤버 정보
     */
    Member insertMember(Member member);

    /**
     * 멤버 수정
     *
     * @param member 멤버 정보
     * @return 멤버 정보
     */
    Member updateMember(Member member);

    /**
     * 멤버 상태 변경
     *
     * @param memberId 멤버 ID
     * @param status   유효 상태
     * @return 멤버 정보
     */
    Member updateMemberStatus(String memberId, String status);

    /**
     * 멤버 로그인 정보 수정
     *
     * @param memberId  멤버 ID
     * @param loginDate 로그인 일시
     * @param loginIp   로그인 아이피
     * @return 멤버 정보
     */
    Member updateMemberLoginInfo(String memberId, Date loginDate, String loginIp);

    /**
     * 멤버 로그인 정보 수정
     *
     * @param memberId  멤버 ID
     * @param loginDate 로그인 일시
     * @param loginIp   로그인 아이피
     * @param expireDt  계정만료일
     * @return 멤버 정보
     */
    Member updateMemberLoginInfo(String memberId, Date loginDate, String loginIp, Date expireDt);

    /**
     * 멤버 로그인 정보 수정
     *
     * @param member    멤버 정보
     * @param loginDate 로그인 일시
     * @param loginIp   로그인 아이피
     * @return 멤버 정보
     */
    Member updateMemberLoginInfo(Member member, Date loginDate, String loginIp);

    /**
     * 멤버 로그인 정보 수정
     *
     * @param member    멤버 정보
     * @param loginDate 로그인 일시
     * @param loginIp   로그인 아이피
     * @param expireDt  계정만료일
     * @return 멤버 정보
     */
    Member updateMemberLoginInfo(Member member, Date loginDate, String loginIp, Date expireDt);

    /**
     * 로그인 실패 정보 수정
     *
     * @param memberId 멤버 ID
     * @param errorCnt 오류 건수
     * @return 멤버 정보
     */
    Member updateMemberLoginErrorCount(String memberId, Integer errorCnt);

    /**
     * 로그인 실패 정보 수정
     *
     * @param memberId 멤버 ID
     * @return 멤버 정보
     */
    Member addMemberLoginErrorCount(String memberId);

    /**
     * 로그인 실패 정보 수정
     *
     * @param member 멤버 정보
     * @return 멤버 정보
     */
    Member addMemberLoginErrorCount(Member member);


    /**
     * 멤버 삭제
     *
     * @param member 멤버 정보
     */
    void deleteMember(Member member);

    /**
     * 멤버 삭제
     *
     * @param memberId 멤버 ID
     */
    void deleteMemberById(String memberId);

    /**
     * 아이디 존재 여부
     *
     * @param memberId 멤버 ID
     * @return 존재 여부
     */
    boolean isDuplicatedId(String memberId);


    /**
     * 그룹 멤버 등록
     *
     * @param groupMember 그룹 멤버 정보
     * @return 그룹 정보
     */
    GroupMember insertGroupMember(GroupMember groupMember);

    /**
     * 그룹 멤버 수정
     *
     * @param groupMember 그룹 멤버 정보
     * @return 그룹 정보
     */
    GroupMember updateGroupMember(GroupMember groupMember);

    /**
     * 그룹 멤버 삭제
     *
     * @param groupMember 그룹 멤버 정보
     */
    void deleteGroupMember(GroupMember groupMember);

    /**
     * 그룹 멤버 삭제
     *
     * @param seqNo 그룹 멤버 일련번호
     */
    void deleteGroupMember(Long seqNo);
}
