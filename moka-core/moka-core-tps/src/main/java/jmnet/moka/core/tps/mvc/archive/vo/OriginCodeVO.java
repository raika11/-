package jmnet.moka.core.tps.mvc.archive.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.vo
 * ClassName : OriginCodeVO
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 18:07
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OriginCodeVO {
    /**
     * 출처 코드(all, regPhoto, regImage ... 등 / all, coverage, newsis)
     */
    private String code;
    /**
     * 매체코드
     */
    private String siteCd;
    /**
     * 출처 명( 전체 목록, 등록사진목록, 등록이미지목록 … 등 / 전체 목록, 취재사진, 뉴시스 등)
     */
    private String label;

}
