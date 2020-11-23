/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-17
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeskingWorkDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<DeskingWorkDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    private Long seq;

    /**
     * 화면편집SEQ
     */
    private Integer deskingSeq;

    /**
     * 데이터셋SEQ
     */
    private Long datasetSeq;

    /**
     * 서비스기사아이디
     */
    private Long totalId;

    /**
     * 부모 서비스기사아이디
     */
    private Long parentTotalId;

    /**
     * 콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상
     */
    private String contentType;

    /**
     * 기사타입
     */
    @Builder.Default
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

    /**
     * 출처
     */
    private String sourceCode;

    /**
     * 콘텐트순서
     */
    @Builder.Default
    private Integer contentOrd = 1;

    /**
     * 관련순서
     */
    @Builder.Default
    private Integer relOrd = 1;

    /**
     * 언어(기타코드)
     */
    @Builder.Default
    private String lang = TpsConstants.DEFAULT_LANG;

    /**
     * 배부일시
     */
    @DTODateTimeFormat
    private Date distDt;

    /**
     * 제목
     */
    private String title;

    /**
     * 부제목
     */
    private String subTitle;

    /**
     * 어깨제목
     */
    private String nameplate;

    /**
     * 말머리
     */
    private String titlePrefix;

    /**
     * 발췌문
     */
    private String bodyHead;

    /**
     * 링크URL
     */
    private String linkUrl;

    /**
     * 링크TARGET
     */
    private String linkTarget;

    /**
     * 더보기URL
     */
    private String moreUrl;

    /**
     * 더보기TARGET
     */
    private String moreTarget;

    /**
     * 썸네일파일명
     */
    private String thumbFileName;

    /**
     * 썸네일용량
     */
    @Builder.Default
    private Integer thumbSize = 0;

    /**
     * 썸네일가로
     */
    @Builder.Default
    private Integer thumbWidth = 0;

    /**
     * 썸네일세로
     */
    @Builder.Default
    private Integer thumbHeight = 0;

    /**
     * 생성일시
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 생성자
     */
    private String regId;

    /**
     * 이미지파일
     */
    @JsonIgnore
    private MultipartFile thumbnailFile;

    /**
     * 컴포넌트SEQ
     */
    private Long componentSeq;
}
