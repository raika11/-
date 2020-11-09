package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 관련기사
 */
@Entity
@Table(name = "TB_JPOD_EPISODE_REL_ART")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodEpisodeRelArt implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 에피소드 관련기사 ID
     */
    @EmbeddedId
    private JpodEpisodeRelArtPK id;

    //bi-directional many-to-one association to Collection
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EPSD_SEQ", insertable = false, updatable = false)
    private JpodEpisode episode;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;


    /**
     * 제목
     */
    @Column(name = "REL_TITLE")
    private String relTitle;

    /**
     * 링크
     */
    @Column(name = "REL_LINK")
    private String relLink;

    /**
     * 링크타겟
     */
    @Column(name = "REL_LINK_TARGET")
    private String relLinkTarget;

}
