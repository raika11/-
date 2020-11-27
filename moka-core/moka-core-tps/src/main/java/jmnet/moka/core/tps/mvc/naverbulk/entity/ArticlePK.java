package jmnet.moka.core.tps.mvc.naverbulk.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.entity
 * ClassName : ArticlePK
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 11:19
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class ArticlePK implements Serializable {

    /**
     * 클릭기사일련번호
     */
    @Column(name = "CLICKART_SEQ", nullable = false)
    private Long clickartSeq;

    /**
     * 정렬번호
     */
    @Column(name = "ORD_NO")
    private Long ordNo;
}
