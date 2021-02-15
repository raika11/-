package jmnet.moka.web.push.mvc.sender.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 푸시항목 설정정보
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_MOB_PUSH_ITEM")
public class MobPushItem implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 푸시항목일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PUSH_ITEM_SEQ", nullable = false)
    private Long pushItemSeq;

    /**
     * 토큰일련번호
     */
    @Column(name = "TOKEN_SEQ", nullable = false)
    private Integer tokenSeq;

    /**
     * 푸시 유형(속보, 미세먼지뉴스, 미세먼지예보 등)
     */
    @Column(name = "PUSH_TYPE", nullable = false)
    private String pushType;

    /**
     * 푸시 시간(07,11,18 컴마구분)
     */
    @Column(name = "PUSH_TIME")
    private String pushTime;

    /**
     * 푸시 항목별 세부 설정(예:미세먼지 푸시지역)
     */
    @Column(name = "PUSH_OPTION")
    private String pushOption;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    @Transient
    private Date reserveDt;

}
