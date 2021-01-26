package jmnet.moka.core.tps.mvc.comment.dto;

import java.io.Serializable;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentUrlDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * url 일련번호
     */
    private Integer urlSeq;

    /**
     * 도메인
     */
    private String domain;

    /**
     * 섹션
     */
    @Column(name = "SECTION", nullable = false)
    private String section;

    /**
     * 상세 정보
     */
    @Column(name = "INFO_DESC", nullable = false)
    private String infoDesc;

    /**
     * 그룹 ID
     */
    @Column(name = "GROUP_ID")
    private Integer urlGrp = 1;

}
