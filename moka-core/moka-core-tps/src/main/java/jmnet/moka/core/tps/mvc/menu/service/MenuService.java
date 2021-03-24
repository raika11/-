package jmnet.moka.core.tps.mvc.menu.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNodeDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * 2020. 6. 22. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 22. 오전 11:40:40
 */
public interface MenuService {

    String ROOT_MENU_ID = "00";

    /**
     * <pre>
     * 메뉴목록 조회
     * </pre>
     *
     * @return 메뉴목록
     */
    MenuNodeDTO findServiceMenuTree(MenuSearchDTO search);

    /**
     * <pre>
     * 메뉴목록 조회
     * </pre>
     *
     * @return 메뉴목록
     */
    MenuNodeDTO findMenuTree(MenuSearchDTO search);

    /**
     * 메뉴 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<Menu> findAllMenu(MenuSearchDTO search);

    /**
     * 하위 메뉴 목록 조회
     *
     * @param parentMenuId 검색 조건
     * @return 검색 결과
     */
    List<Menu> findAllMenuByParentId(String parentMenuId);

    /**
     * 하위 메뉴 건수 조회
     *
     * @param parentMenuId 검색 조건
     * @return 검색 결과
     */
    Long countMenuByParentId(String parentMenuId);

    /**
     * 메뉴 전체 목록 조회
     *
     * @return 메뉴 목록
     */
    List<Menu> findAllMenu();

    /**
     * 메뉴 일련번호로 상세 조회
     *
     * @param menuSeq 메뉴 일련번호
     * @return 메뉴 정보
     */
    Optional<Menu> findMenuBySeq(Long menuSeq);

    /**
     * 메뉴 아이디로 상세 조회
     *
     * @param menuId 메뉴 ID
     * @return 메뉴 정보
     */
    Optional<Menu> findMenuById(String menuId);

    /**
     * 메뉴 등록
     *
     * @param menu 메뉴 정보
     * @return 메뉴 정보
     */
    Menu insertMenu(Menu menu);

    /**
     * 메뉴 수정
     *
     * @param menu 메뉴 정보
     * @return 메뉴 정보
     */
    Menu updateMenu(Menu menu);

    /**
     * 메뉴 삭제 권한까지 삭제한다.
     *
     * @param menu 메뉴 정보
     */
    @Transactional
    void deleteMenu(Menu menu);

    /**
     * 메뉴 아이디로 삭제
     *
     * @param menuId 메뉴 아이디
     */
    void deleteMenuById(String menuId);

    /**
     * 메뉴 ID 중복 여부
     *
     * @param menuId 메뉴ID
     * @return 중복 여부
     */
    boolean isDuplicatedId(String menuId);

    /**
     * 메뉴 그룹 및 멤버 사용 여부
     *
     * @param menuId 메뉴 ID
     * @return 사용 여부
     */
    boolean isUsedGroupOrMember(String menuId);

    /**
     * 메뉴 권한 등록
     *
     * @param menuAuth 메뉴 권한
     * @return 메뉴 권한
     */
    MenuAuth insertMenuAuth(MenuAuth menuAuth);

    /**
     * 멤버의 메뉴 권한 부여
     *
     * @param memberId 멤버 ID
     * @param menuIds  메뉴 ID
     * @return 성공 건수
     */
    int appendMemberMenuAuth(String memberId, String[] menuIds);

    /**
     * 그룹의 메뉴 권한 부여
     *
     * @param groupCd 그룹 코드
     * @param menuIds 메뉴 ID
     * @return 성공 건수
     */
    int appendGroupMenuAuth(String groupCd, String[] menuIds);

    /**
     * 멤버의 메뉴 권한 부여
     *
     * @param memberIds 멤버 ID
     * @param menuId    메뉴 ID
     * @return 성공 건수
     */
    int appendMemberMenuAuth(String[] memberIds, String menuId);

    /**
     * 그룹의 메뉴 권한 부여
     *
     * @param groupCds 그룹 코드
     * @param menuId   메뉴 ID
     * @return 성공 건수
     */
    int appendGroupMenuAuth(String[] groupCds, String menuId);

    /**
     * 사용자별 메뉴 권한 추가
     *
     * @param groupMemberIds 사용자 ID 목록
     * @param menuId         메뉴 ID
     * @return 성공 건수
     */
    int appendMenuAuth(String[] groupMemberIds, String menuId, MenuAuthTypeCode menuAuthTypeCode);

    /**
     * 사용자별 메뉴 권한 추가
     *
     * @param groupMemberIds   사용자 ID 목록
     * @param menu             메뉴 정보
     * @param menuAuthTypeCode 메뉴 권한 유형 코드
     * @return 성공 건수
     */
    int appendMenuAuth(String[] groupMemberIds, Menu menu, MenuAuthTypeCode menuAuthTypeCode);

    /**
     * 사용자별 메뉴 권한 추가
     *
     * @param groupMemberId    멤버 ID
     * @param menuId           메뉴 ID
     * @param menuAuthTypeCode 메뉴 권한 유형 코드
     * @return 메뉴 권한 정보
     */
    MenuAuth appendMenuAuth(String groupMemberId, String menuId, MenuAuthTypeCode menuAuthTypeCode);

    /**
     * 사용자별 메뉴 권한 추가
     *
     * @param groupMemberId    멤버 ID
     * @param menu             메뉴 정보
     * @param menuAuthTypeCode 메뉴 권한 유형 코드
     * @return 메뉴 권한 정보
     */
    MenuAuth appendMenuAuth(String groupMemberId, Menu menu, MenuAuthTypeCode menuAuthTypeCode);

    /**
     * 메뉴 권한 수정
     *
     * @param menuAuth 메뉴 권한
     * @return 메뉴 권한
     */
    MenuAuth updateMenuAuth(MenuAuth menuAuth);

    /**
     * 메뉴 권한 삭제
     *
     * @param menuAuth 메뉴 권한
     */
    void deleteMenuAuth(MenuAuth menuAuth);

    /**
     * 메뉴 권한 일련번호로 삭제
     *
     * @param seqNo 메뉴 권한
     */
    void deleteMenuAuth(Long seqNo);

    /**
     * 메뉴 아이디로 메뉴 권한 목록 조회
     *
     * @param menuAuth 메뉴 권한
     * @return 메뉴 권한
     */
    MenuAuth findMenuAuth(MenuAuth menuAuth);

    /**
     * 사용자 아이디와 메뉴 아이디로 메뉴 권한 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 메뉴 권한 일련번호
     */
    Long findMenuAuthSeq(MenuSearchDTO searchDTO);

    /**
     * 메뉴 아이디로 메뉴 권한 목록 조회
     *
     * @param menuId 메뉴 ID
     * @return 메뉴 권한 목록
     */
    List<MenuAuth> findMenuAuthList(String menuId);

    /**
     * 그룹멤버ID와 그룹멤버구분으로 메뉴 권한 목록 조회
     *
     * @param groupMemberId  그룹멤버ID
     * @param groupMemberDiv 그룹멤버구분
     * @return 메뉴 권한 목록
     */
    List<MenuAuth> findMenuAuthList(String groupMemberId, String groupMemberDiv);

    /**
     * 전체 메뉴 path 정보를 불러온다.
     *
     * @return 메뉴 path
     */
    Set<String> findAllMenuUrl();

    /**
     * 메뉴 권한 저장
     *
     * @param menuId       아아디
     * @param menuAuthType 권한 구분
     * @param menuAuth     권한 정보
     */
    void saveMenuAuth(String menuId, MenuAuthTypeCode menuAuthType, MenuAuth menuAuth);

    /**
     * 메뉴 권한 저장
     *
     * @param groupMemberId 그룹멤버ID
     * @param menuAuthType  권한 구분
     * @param menuAuths     권한 정보 목록
     */
    void saveMenuAuth(String groupMemberId, MenuAuthTypeCode menuAuthType, List<MenuAuth> menuAuths);

    /**
     * 메뉴 권한 저장
     *
     * @param groupMemberId   그룹멤버ID
     * @param menuAuthType    권한 구분
     * @param menuAuths       권한 정보 목록
     * @param isOldMenuDelete 기존 메뉴 삭제 처리 여부
     */
    void saveMenuAuth(String groupMemberId, MenuAuthTypeCode menuAuthType, List<MenuAuth> menuAuths, boolean isOldMenuDelete);
}
