package jmnet.moka.core.tps.mvc.menu.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.entity.QMenuAuth;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class MenuAuthRepositorySupportImpl extends QuerydslRepositorySupport implements MenuAuthRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public MenuAuthRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(MenuAuth.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Optional<MenuAuth> findGroupMemberDivMenu(String groupMemberId, String menuId, String groupMemberDiv) {
        return findGroupMemberDivMenu(MenuAuth
                .builder()
                .groupMemberDiv(groupMemberDiv)
                .menuId(menuId)
                .groupMemberId(groupMemberId)
                .build());
    }

    @Override
    public Optional<MenuAuth> findGroupMemberDivMenu(MenuAuth menuAuth) {
        QMenuAuth qMenuAuth = QMenuAuth.menuAuth;

        JPQLQuery<MenuAuth> query = from(qMenuAuth);

        query.where(qMenuAuth.groupMemberId.eq(menuAuth.getGroupMemberId()));
        query.where(qMenuAuth.menuId.eq(menuAuth.getMenuId()));
        query.where(qMenuAuth.groupMemberDiv.eq(menuAuth.getGroupMemberDiv()));

        return Optional.ofNullable(query.fetchFirst());
    }
}
