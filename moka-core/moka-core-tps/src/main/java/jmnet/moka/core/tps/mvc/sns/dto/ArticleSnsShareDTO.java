package jmnet.moka.core.tps.mvc.sns.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.sql.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 기사 SNS메타
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("SNS 공유 DTO")
public class ArticleSnsShareDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<ArticleSnsShareDTO>>() {
    }.getType();

    private ArticleSnsShareId id;

    /**
     * 기사 기본 정보
     */
    @ApiModelProperty(hidden = true)
    private ArticleBasicDTO articleBasic;



    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    private String usedYn;

    /**
     * SNS 전송일시(업데이트시 수정됨)
     */
    @ApiModelProperty(hidden = true)
    private Date snsInsDt;

    /**
     * SNS 등록일시
     */
    @ApiModelProperty(hidden = true)
    private Date snsRegDt;

    /**
     * SNS 기사ID
     */
    @ApiModelProperty("SNS 기사ID")
    private String snsArtId;

    /**
     * SNS 전송상태
     */
    @ApiModelProperty("SNS 전송상태")
    private String snsArtSts;

    /**
     * 예약일시
     */
    @ApiModelProperty("예약일시")
    private Date reserveDt;

    /**
     * 포스트 메시지
     */
    @ApiModelProperty("포스트 메시지")
    private String snsPostMsg;

    /**
     * 이미지
     */
    @ApiModelProperty("이미지")
    private String imgUrl;

    /**
     * 기사제목
     */
    @ApiModelProperty("기사제목")
    private String artTitle;

    /**
     * 메타데이터 추가 키워드
     */
    @ApiModelProperty("메타데이터 추가 키워드")
    private String artKeyword;

    /**
     * 설명
     */
    @ApiModelProperty("설명")
    private String artSummary;

}
