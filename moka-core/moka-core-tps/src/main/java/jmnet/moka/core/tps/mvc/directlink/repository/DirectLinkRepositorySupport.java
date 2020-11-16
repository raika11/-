package jmnet.moka.core.tps.mvc.directlink.repository;

import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.directlink.repository
 * ClassName : DirectLinkRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public interface DirectLinkRepositorySupport {

    /**
     * 그룹 목록 검색
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    public Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO searchDTO);
}
