package jmnet.moka.core.tps.mvc.watermark.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 워터마크정보
 */
@Entity
@Table(name = "TB_WATERMARK")
@Data
@EqualsAndHashCode(callSuper = true)
public class Watermark extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 출처
     */
    @Column(name = "SOURCE_CODE", nullable = false)
    private String sourceCode;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = "N";

    /**
     * 이미지가로
     */
    @Column(name = "IMG_WIDTH", nullable = false)
    private Integer imgWidth = 0;

    /**
     * 이미지세로
     */
    @Column(name = "IMG_HEIGHT", nullable = false)
    private Integer imgHeight = 0;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String title;

    /**
     * 이미지URL
     */
    @Column(name = "IMG_URL", nullable = false)
    private String imgUrl;

}
