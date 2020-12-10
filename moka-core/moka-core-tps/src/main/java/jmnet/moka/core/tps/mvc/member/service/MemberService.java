package jmnet.moka.core.tps.mvc.member.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.LoginLog;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import org.springframework.data.domain.Page;

public interface MemberService {
    /**
     * 멤버 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과 목록
     */
    Page<MemberInfo> findAllMember(MemberSearchDTO search);

    /**
     * 전체 멤버 조회
     *
     * @return 멤버 목록
     */
    List<MemberInfo> findAllMember();

    /**
     * 멤버 ID로 멤버 상세 조회
     *
     * @param memberId 멤버 ID
     * @return
     */
    Optional<MemberInfo> findMemberById(String memberId);

    /**
     * 멤버 등록
     *
     * @param member 멤버 정보
     * @return 멤버 정보
     */
    MemberInfo insertMember(MemberInfo member);

    /**
     * 멤버 수정
     *
     * @param member 멤버 정보
     * @return 멤버 정보
     */
    MemberInfo updateMember(MemberInfo member);

    /**
     * 멤버 상태 변경
     *
     * @param memberId 멤버 ID
     * @param status   유효 상태
     * @return 멤버 정보
     */
    MemberInfo updateMemberStatus(String memberId, MemberStatusCode status);

    /**
     * 멤버 상태 변경
     *
     * @param memberId 멤버 ID
     * @param status   유효 상태
     * @param errorCnt 비밀번호 오류 건수
     * @param remark   비고
     * @return 멤버 정보
     */
    MemberInfo updateMemberStatus(String memberId, MemberStatusCode status, Integer errorCnt, String remark);

    /**
     * 멤버 상태 변경
     *
     * @param memberId 멤버 ID
     * @param status   유효 상태
     * @param remark   비고
     * @return 멤버 정보
     */
    MemberInfo updateMemberStatus(String memberId, MemberStatusCode status, String remark);

    /**
     * 멤버 로그인 정보 수정
     *
     * @param memberId  멤버 ID
     * @param loginDate 로그인 일시
     * @param loginIp   로그인 아이피
     * @return 멤버 정보
     */
    MemberInfo updateMemberLoginInfo(String memberId, Date loginDate, String loginIp);


    /**
     * 멤버 로그인 정보 수정
     *
     * @param memberId  멤버 ID
     * @param loginDate 로그인 일시
     * @param loginIp   로그인 아이피
     * @param userDTO   사용자 변경 정보
     * @return 멤버 정보
     */
    MemberInfo updateMemberLoginInfo(String memberId, Date loginDate, String loginIp, UserDTO userDTO);


    /**
     * 로그인 실패 정보 수정
     *
     * @param memberId 멤버 ID
     * @param errorCnt 오류 건수
     * @return 멤버 정보
     */
    MemberInfo updateMemberLoginErrorCount(String memberId, Integer errorCnt);


    /**
     * 로그인 실패 정보 수정
     *
     * @param memberId 멤버 ID
     * @return 멤버 정보
     */
    MemberInfo addMemberLoginErrorCount(String memberId);

    /**
     * 로그인 실패 정보 수정
     *
     * @param member 멤버 정보
     * @return 멤버 정보
     */
    MemberInfo addMemberLoginErrorCount(MemberInfo member);


    /**
     * 멤버 삭제
     *
     * @param member 멤버 정보
     */
    void deleteMember(MemberInfo member);

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

    /**
     * 로그인 이력 저장
     *
     * @param log 로그 정보
     * @return 저장 결과
     */
    LoginLog insertLoginLog(LoginLog log);

    /**
     * 로그인 이력 목록 조회
     *
     * @param memberId 멤버 ID
     * @return 로그인 이력 목록
     */
    List<LoginLog> findAllLoginLog(String memberId);

    /**
     * 로그인 이력 목록 조회
     *
     * @param memberId        멤버 ID
     * @param memberSearchDTO 검색 조건
     * @return 로그인 이력 목록
     */
    public Page<LoginLog> findAllLoginLog(String memberId, SearchDTO memberSearchDTO);
}
