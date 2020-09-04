/**
 * msp-tps StyleService.java 2020. 4. 29. 오후 2:50:57 ssc
 */
package jmnet.moka.core.tps.mvc.style.service;

import java.util.Optional;
import javax.validation.Valid;
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
 * @since 2020. 4. 29. 오후 2:50:57
 * @author ssc
 */
public interface StyleService {

    /**
     * <pre>
      * 스타일 목록 조회
     * </pre>
     * 
     * @param search 검색조건
     * @param pageable 페이징
     * @return 스타일목록
     */
    public Page<Style> findList(@Valid StyleSearchDTO search, Pageable pageable);

    /**
     * <pre>
      * 스타일 등록
     * </pre>
     * 
     * @param style 등록할 스타일
     * @return 등록된 스타일
     */
    public Style insertStyle(Style style);

    /**
     * 스타일정보 조회
     * 
     * @param styleSeq 스타일순번
     * @return 스타일정보
     */
    public Optional<Style> findByStyleSeq(Long styleSeq);

}
