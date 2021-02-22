package jmnet.moka.web.push.mvc.sender.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 * 푸시 전송 기사 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushContentsDTO
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:36
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("푸시 전송 기사 이력 DTO")
public class PushContentsProcDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<PushContentsProcDTO>>() {
    }.getType();

    /**
     * 푸시기사 일련번호
     */
    @ApiModelProperty("푸시기사 일련번호")
    private Long contentSeq;

    /**
     * 앱 일련번호
     */
    @ApiModelProperty("앱 일련번호")
    private Long appSeq;

    /**
     * 전송 상태(0 : 전송 전, 1 : 전송 완료, 2 : 서버오류, 3 : 토큰 오류, 4 : 전송 오류, 5 : 타임 오버, 9 : 전송 중)
     */
    @ApiModelProperty("전송 상태")
    private String statusFlag;

    /**
     * 대상 디바이스 건수
     */
    @ApiModelProperty("대상 디바이스 건수")
    private Long targetCnt;

    /**
     * 발송 건수
     */
    @ApiModelProperty("발송 건수")
    private Long sendCnt;

    /**
     * 수신 건수
     */
    @ApiModelProperty("수신 건수")
    private Long rcvCnt;

    /**
     * 오픈 건수
     */
    @ApiModelProperty("오픈 건수")
    private Long openCnt;

    /**
     * 최대 발송 토큰 일련번호
     */
    @ApiModelProperty("최대 발송 토큰 일련번호")
    private Long lastTokenSeq;

    /**
     * 시작일시
     */
    @ApiModelProperty("시작일시")
    private Date startDt;

    /**
     * 종료일시
     */
    @ApiModelProperty("종료일시")
    private Date endDt;
}
