package jmnet.moka.core.tps.mvc.internalinterface.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpMethod;

/**
 * 내부 API 정보
 */
@Entity
@Table(name = "TB_API_LIST")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = true)
public class InternalInterface extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * API명
     */
    @Column(name = "API_NAME", nullable = false)
    private String apiName;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = "Y";

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN", nullable = false)
    private String delYn = "N";

    /**
     * API유형(PC:PC,MO:MOBILE,PM:PC+MOBILE,BO:BACK OFFICE)
     */
    @Column(name = "API_TYPE")
    private String apiType;

    /**
     * API 유형 명
     */
    @Transient
    private String apiTypeName;

    /**
     * GET/POST/PUT/DELETE
     */
    @Column(name = "API_METHOD", nullable = false)
    private String apiMethod = HttpMethod.GET.name();


    /**
     * API경로(HOST경로포함)
     */
    @Column(name = "API_PATH", nullable = false)
    private String apiPath;

    /**
     * API설명
     */
    @Column(name = "API_DESC")
    private String apiDesc;

    /**
     * 파라미터설명(NAME,DESC,REQUIRED,TYPE을결합하여JSON구조로 생성)
     */
    @Column(name = "PARAM_DESC")
    private String paramDesc;

}
