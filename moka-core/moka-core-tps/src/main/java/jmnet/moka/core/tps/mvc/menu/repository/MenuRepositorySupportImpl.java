package jmnet.moka.core.tps.mvc.menu.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.QMenu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.menu.repository
 * ClassName : MenuRepositorySupportImpl
 * Created : 2020-10-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-23 09:38
 */
public class MenuRepositorySupportImpl extends QuerydslRepositorySupport implements MenuRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public MenuRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Menu.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Menu> findAll(MenuSearchDTO searchDTO) {
        QMenu qMenu = QMenu.menu;

        JPQLQuery<Menu> query = from(qMenu);
        if (McpString.isNotEmpty(searchDTO.getMenuId())) {
            query.where(qMenu.menuId
                    .toUpperCase()
                    .contains(searchDTO
                            .getMenuId()
                            .toUpperCase()));
        }
        if (McpString.isNotEmpty(searchDTO.getMenuNm())) {
            query.where(qMenu.menuNm
                    .toUpperCase()
                    .contains(searchDTO
                            .getMenuNm()
                            .toUpperCase()));
        }
        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }
        QueryResults<Menu> list = query.fetchResults();
        return new PageImpl<Menu>(list.getResults(), pageable, list.getTotal());
    }
}
