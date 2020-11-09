package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 키워드
 */
@Entity
@Table(name = "TB_JPOD_KEYWORD")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodKeyword implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 에피소드 키워드 ID
     */
    @EmbeddedId
    private JpodKeywordPK id;

    /**
     * 키워드
     */
    @Column(name = "KEYWORD", nullable = false)
    private String keyword;

}
