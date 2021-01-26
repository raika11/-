package jmnet.moka.core.tps.mvc.search.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자 검색 로그
 */
@Entity
@Table(name = "TB_SEARCH_KWD_LOG")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(callSuper = true)
public class SearchKwdLog extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 디바이스 구분(P:PC, M:MOBILE)
     */
    @Column(name = "DEV_DIV", nullable = false)
    private String devDiv;

    /**
     * 탭구분(MAIN, TOT, NEWS, IMG, VOD, JOINS, PEOPLE)
     */
    @Column(name = "TAB_DIV")
    private String tabDiv;

    /**
     * 리퍼러URL
     */
    @Column(name = "REF_URL")
    private String refUrl;

    /**
     * 검색어
     */
    @Column(name = "SCH_KWD")
    private String schKwd;

}
