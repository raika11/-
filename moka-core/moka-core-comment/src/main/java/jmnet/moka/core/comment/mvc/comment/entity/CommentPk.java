package jmnet.moka.core.comment.mvc.comment.entity;

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
 * Package : jmnet.moka.core.tps.comment.entity
 * ClassName : CommentPk
 * Created : 2020-12-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-28 09:51
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class CommentPk implements Serializable {

    @Column(name = "CMTSN", nullable = false)
    private Long commentSeq;

    @Column(name = "CMTPSN", nullable = false)
    @Builder.Default
    private Long psn = 0L;
}
