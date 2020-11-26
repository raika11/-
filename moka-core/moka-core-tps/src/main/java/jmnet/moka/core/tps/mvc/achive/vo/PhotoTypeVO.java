package jmnet.moka.core.tps.mvc.achive.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 포토아카이브 사진 유형 목록
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.vo
 * ClassName : PhotoTypeVO
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:55
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PhotoTypeVO {
    /**
     * 코드 값(이미지 상세 조회 patTyCd에 사용.)
     */
    private String cd;
    /**
     * 사진 유형 목록 값(Image, Photo, Illust 등, 이미지 목록 조회시 사용.)
     */
    private String name;
    /**
     * 설명(이미지, 촬영사진, 일러스트 등)
     */
    private String label;

}
