package jmnet.moka.web.schedule.mvc.mybatis.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.dto
 * ClassName : AirkoreaInfoJobDTO
 * Created : 2021-04-14
 * </pre>
 *
 * @author 유영제
 * @since 2021-04-14
 */

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ApiModel(description = "UPA_AIRKOREA_MESURE_ITEM_INS procedure 실행용 DTO")
public class AirkoreaInfoJobDTO implements Serializable {

    /**
     * 측정시간
     */
    @ApiModelProperty("MISE_DT")
    private String dataTime;

    /**
     * 아이템 코드
     */
    @ApiModelProperty("ITEM_CODE")
    private String itemCode;

    /**
     * 서울
     */
    @ApiModelProperty("SEOUL")
    private double seoul;

    /**
     * 부산
     */
    @ApiModelProperty("BUSAN")
    private double busan;

    /**
     * 대구
     */
    @ApiModelProperty("DAEGU")
    private double daegu;

    /**
     * 인천
     */
    @ApiModelProperty("INCHEON")
    private double incheon;

    /**
     * 광주
     */
    @ApiModelProperty("GWANGJU")
    private double gwangju;

    /**
     * 대전
     */
    @ApiModelProperty("DAEJEON")
    private double daejeon;

    /**
     * 울산
     */
    @ApiModelProperty("ULSAN")
    private double ulsan;

    /**
     * 경기
     */
    @ApiModelProperty("GYEONGGI")
    private double gyeonggi;

    /**
     * 강원
     */
    @ApiModelProperty("GANGWON")
    private double gangwon;

    /**
     * 충북
     */
    @ApiModelProperty("CHUNGBUK")
    private double chungbuk;

    /**
     * 충남
     */
    @ApiModelProperty("CHUNGNAM")
    private double chungnam;

    /**
     * 전북
     */
    @ApiModelProperty("JEONBUK")
    private double jeonbuk;

    /**
     * 전남
     */
    @ApiModelProperty("JEONNAM")
    private double jeonnam;

    /**
     * 경북
     */
    @ApiModelProperty("GYEONGBUK")
    private double gyeongbuk;

    /**
     * 경남
     */
    @ApiModelProperty("GYEONGNAM")
    private double gyeongnam;

    /**
     * 제주
     */
    @ApiModelProperty("JEJU")
    private double jeju;

    /**
     * 세종
     */
    @ApiModelProperty("SEJONG")
    private double sejong;
}

