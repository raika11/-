package jmnet.moka.core.tps.mvc.bulk.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.entity
 * ClassName : BulkArticlePK
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
public class BulkArticlePK implements Serializable {

    /**
     * 클릭기사일련번호
     */
    @Column(name = "BULKART_SEQ", nullable = false)
    private Long bulkartSeq;

    /**
     * 정렬번호
     */
    @Column(name = "ORD_NO", nullable = false)
    private Long ordNo;

}
