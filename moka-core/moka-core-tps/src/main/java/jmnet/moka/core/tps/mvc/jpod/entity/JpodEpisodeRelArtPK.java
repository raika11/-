package jmnet.moka.core.tps.mvc.jpod.entity;

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
 * ClassName : JpodEpisodeRelArtPk
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
public class JpodEpisodeRelArtPK implements Serializable {

    /**
     * 에피소드일련번호
     */
    @Column(name = "EPSD_SEQ", nullable = false)
    private Long epsdSeq;

    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId;

    /**
     * 채널일련번호
     */
    @Column(name = "CHNL_SEQ", nullable = false)
    private Long chnlSeq;


}
