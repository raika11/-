package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 채널
 */
@Entity
@Table(name = "TB_JPOD_CHANNEL")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = true)
public class JpodChannel extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 채널일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHNL_SEQ", nullable = false)
    private Long chnlSeq;

    /**
     * 사용여부
     */
    @Builder.Default
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = MokaConstants.YES;

    /**
     * 채널명
     */
    @Column(name = "CHNL_NM", nullable = false)
    private String chnlNm;

    /**
     * 채널소개
     */
    @Column(name = "CHNL_MEMO", nullable = false)
    private String chnlMemo;

    /**
     * 채널 개설일
     */
    @Column(name = "CHNL_SDATE", nullable = false)
    private String chnlSdt;

    /**
     * 커버이미지
     */
    @Column(name = "CHNL_IMG")
    private String chnlImg;

    /**
     * 썸네일이미지
     */
    @Column(name = "CHNL_THUMB")
    private String chnlThumb;

    /**
     * 팟티채널
     */
    @Column(name = "PODTY_URL")
    private String podtyUrl;

    /**
     * 채널 종료일
     */
    @Column(name = "CHNL_EDATE")
    private String chnlEdt;

    /**
     * 채널 방송 요일
     */
    @Column(name = "CHNL_DY")
    private String chnlDy;

    /**
     * 모바일용 이미지
     */
    @Column(name = "CHNL_IMG_MOB")
    private String chnlImgMob;

    /**
     * 팟티채널SRL
     */
    @Builder.Default
    @Column(name = "PODTY_CHNL_SRL", nullable = false)
    private Integer podtyChnlSrl = 0;

}
