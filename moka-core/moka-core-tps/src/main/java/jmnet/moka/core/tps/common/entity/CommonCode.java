package jmnet.moka.core.tps.common.entity;

import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 코드와 명으로 이루어진 리턴값 전달용
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto
 * ClassName : CommonCodeDTO
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 09:11
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommonCode {

    /**
     * 코드
     */
    @Column(name = "CODE", insertable = false, updatable = false)
    private String code;

    /**
     * 코드명
     */
    @Column(name = "NAME", insertable = false, updatable = false)
    private String name;
}
