package jmnet.moka.core.tps.mvc.menu.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MenuAuthRepository extends JpaRepository<MenuAuth, Long>, JpaSpecificationExecutor<MenuAuth>, MenuAuthRepositorySupport {

    /**
     * 메뉴ID로 메뉴권한 목록 조회
     *
     * @param menuId 메뉴 ID
     * @return 메뉴권한 목록
     */
    public List<MenuAuth> findAllByMenuId(String menuId);

    /**
     * 메뉴ID로 메뉴권한 건수 조회
     *
     * @param menuId 메뉴 ID
     * @return 메뉴권한 건수
     */
    public Long countByMenuId(String menuId);

    /**
     * 그룹멤버 ID로 메뉴권한 목록 조회
     *
     * @param groupMemberId  그룹멤버 ID
     * @param groupMemberDiv 그룹멤버 구분
     * @return 메뉴권한 목록
     */
    public List<MenuAuth> findAllByGroupMemberIdAndGroupMemberDiv(String groupMemberId, String groupMemberDiv);
}
