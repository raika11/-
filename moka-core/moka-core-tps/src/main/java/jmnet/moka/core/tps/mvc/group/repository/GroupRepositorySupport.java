package jmnet.moka.core.tps.mvc.group.repository;

import jmnet.moka.core.tps.mvc.group.dto.GroupSearchDTO;
import jmnet.moka.core.tps.mvc.group.entity.Group;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : GroupRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public interface GroupRepositorySupport {

    /**
     * 그룹 목록 검색
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    public Page<Group> findAllGroup(GroupSearchDTO searchDTO);
}
