package jmnet.moka.core.tps.mvc.member.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 권한그룸
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_GROUP")
public class Group implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 그룹코드 (G01, G02형식)
     */
    @Id
    @Column(name = "GRP_CD", nullable = false)
    private String groupCd;

    /**
     * 그룹명
     */
    @Column(name = "GRP_NM", nullable = false)
    private String groupNm;

    /**
     * 그룹 한글명
     */
    @Column(name = "GRP_KOR_NM")
    private String groupKorNm = "";

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    @Builder.Default
    private Date regDt = new Date();

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    @Builder.Default
    private String regId = "";

}
