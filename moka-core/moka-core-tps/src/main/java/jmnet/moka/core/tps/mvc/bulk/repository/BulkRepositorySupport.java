package jmnet.moka.core.tps.mvc.bulk.repository;

import jmnet.moka.core.tps.mvc.bulk.dto.BulkSearchDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.naverbulk.repository
 * ClassName : BulkRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public interface BulkRepositorySupport {

    /**
     * 벌크문구 목록검색
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    public Page<Bulk> findAllBulkList(BulkSearchDTO searchDTO);

    public void updateArticle(Bulk bulk);


}
