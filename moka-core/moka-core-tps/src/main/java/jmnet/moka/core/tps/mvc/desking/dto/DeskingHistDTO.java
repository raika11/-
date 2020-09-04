package jmnet.moka.core.tps.mvc.desking.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingRelHist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 데스킹 히스토리 DTO
 * 
 * @author jeon0525
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeskingHistDTO implements Serializable {

    private static final long serialVersionUID = -5657517107362421109L;

    public static final Type TYPE = new TypeReference<List<DeskingHistDTO>>() {
    }.getType();

    private Long histSeq;

    private Long deskingSeq;

    private Dataset dataset;

    private Long editionSeq;

    private String contentsId;

    private String contentsAttr;

    private String lang;

    private String distYmdt;

    private Integer contentsOrder;

    private String title;

    private String mobileTitle;

    private String subtitle;

    private String nameplate;

    private String titlePrefix;

    private String bodyHead;

    private String linkUrl;

    private String linkTarget;

    private String moreUrl;

    private String moreTarget;

    private String thumbnailFileName;

    private Integer thumbnailSize;

    private Integer thumbnailWidth;

    private Integer thumbnailHeight;

    private String deskingYmdt;

    private String createYmdt;

    private String creator;

    @Builder.Default
    private Set<DeskingRelHist> deskingRelHists = new LinkedHashSet<DeskingRelHist>();
}
