package jmnet.moka.core.tps.mvc.member.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.Group;
import jmnet.moka.core.tps.mvc.member.entity.GroupMember;
import org.springframework.data.domain.Page;

public interface GroupService {
    /**
     * 그룹 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과 목록
     */
    Page<Group> findGroupList(SearchDTO search);

    /**
     * 전체 그룹 조회
     *
     * @return 그룹 목록
     */
    List<Group> findGroupList();

    /**
     * 그룹 내 사용자 목록 조회
     *
     * @return 그룹 목록
     */
    List<GroupMember> findGroupMemberList(String groupCd);

    /**
     * 그룹 ID로 그룹 상세 조회
     *
     * @param groupId 그룹 ID
     * @return
     */
    Optional<Group> findGroupById(String groupId);

    /**
     * 그룹 등록
     *
     * @param group 그룹 정보
     * @return 그룹 정보
     */
    Group insertGroup(Group group);

    /**
     * 그룹 수정
     *
     * @param group 그룹 정보
     * @return 그룹 정보
     */
    Group updateGroup(Group group);

    /**
     * 그룹 삭제
     *
     * @param group 그룹 정보
     */
    void deleteGroup(Group group);

    /**
     * 그룹 삭제
     *
     * @param groupId 그룹 ID
     */
    void deleteGroupById(String groupId);

    /**
     * 아이디 존재 여부
     *
     * @param groupId 그룹 ID
     * @return 존재 여부
     */
    boolean isDuplicatedId(String groupId);


    /**
     * 그룹에 속한 멤버 존재 여부 조회
     *
     * @param groupId 그룹 ID
     * @return 존재 여부
     */
    boolean hasMembers(String groupId);
}
