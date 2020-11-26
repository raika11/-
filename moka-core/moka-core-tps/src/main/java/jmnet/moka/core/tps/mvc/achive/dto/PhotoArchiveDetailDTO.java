package jmnet.moka.core.tps.mvc.achive.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.vo
 * ClassName : PhotoArchiveVO
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
public class PhotoArchiveDetailDTO extends PhotoArchiveDTO {

    public static final Type TYPE = new TypeReference<List<PhotoArchiveDetailDTO>>() {
    }.getType();


    private String dc;

    private String tag;

    private String originCd;

    private String photoMemo;

    private String photoYn;

    private String regDt;

    private String modDt;

    private String regNm;

    private String modifier;

    private String imageCtsWidth;

    private String imageCtsVrticl;

    private String embargoDt;

    private String patTyCd;

}
