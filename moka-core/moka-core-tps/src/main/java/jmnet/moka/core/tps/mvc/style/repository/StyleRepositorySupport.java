/**
 * msp-tps StyleRepositorySupport.java 2020. 4. 29. 오후 3:03:00 ssc
 */
package jmnet.moka.core.tps.mvc.style.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.style.dto.StyleSearchDTO;
import jmnet.moka.core.tps.mvc.style.entity.Style;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 3:03:00
 * @author ssc
 */
public interface StyleRepositorySupport {
    // 페이지목록. 페이징O
    public Page<Style> findList(StyleSearchDTO search, Pageable pageable);
}
