package jmnet.moka.web.schedule.mvc.sns.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import jmnet.moka.core.common.sns.SnsTypeCode;
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
 * Package : jmnet.moka.core.tps.mvc.sns.entity
 * ClassName : ArticleSnsSharePK
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 09:45
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class ArticleSnsSharePK implements Serializable {
    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId;

    /**
     * SNS 타입{FB:페이스북, TW:트위터}
     */
    @Column(name = "SNS_TYPE", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private SnsTypeCode snsType = SnsTypeCode.FB;
}
