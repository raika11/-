package jmnet.moka.core.tps.mvc.schedule.server.entity;

import jmnet.moka.core.common.MokaConstants;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 배포서버 이름 엔티티
 * 2021. 2. 3. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_TARGET")
public class DistributeServerSimple implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 서버 번호
     */
    @Id
    @Column(name = "SERVER_SEQ", nullable = false)
    private Long serverSeq;

    /**
     * 서버 명
     */
    @Column(name = "SERVER_NM")
    private String serverNm;

}
