package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 채널
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodChannelDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<JpodChannelDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    /**
     * 채널일련번호
     */
    private Long chnlSeq;

    /**
     * 사용여부
     */
    @Builder.Default
    private String usedYn = "N";

    /**
     * 채널명
     */
    private String chnlNm;

    /**
     * 채널소개
     */
    private String chnlMemo;

    /**
     * 채널 개설일
     */
    private String chnlSdt;

    /**
     * 커버이미지
     */
    private String chnlImg;

    /**
     * 썸네일이미지
     */
    private String chnlThumb;

    /**
     * 팟티채널
     */
    private String podtyUrl;

    /**
     * 채널 종료일
     */
    private String chnlEdt;

    /**
     * 채널 방송 요일
     */
    private String chnlDy;

    /**
     * 모바일용 이미지
     */
    private String chnlImgMob;

    /**
     * 팟티채널SRL
     */
    @Builder.Default
    private Integer podtyChnlSrl = 0;

}
