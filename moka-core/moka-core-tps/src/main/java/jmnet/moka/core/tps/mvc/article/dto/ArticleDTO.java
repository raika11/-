package jmnet.moka.core.tps.mvc.article.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 아티클 DTO
 * 
 * @author jeon0525
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ArticleDTO {

    private Long Seq;

    private String adServiceYn;

    private Integer bylineDeptNo;

    private String bylineId;

    private String bylineName;

    private String cmntServiceYn;

    private String contentsBody;

    private String contentsId;

    private String contentsLevel;

    private String contentsStatus;

    private String contentsText;

    private String copyright;

    private String createYmdt;

    private String creator;

    private String distChannel;

    private Integer distFlag;

    private String distYmdt;

    private String distributor;

    private Integer embargoFlag;

    private String embargoYmdt;

    private String lang;

    private String mediaId;

    private String modifiedYmdt;

    private String modifier;

    private String orgContentsId;

    private String orgTitle;

    private String refTypes;

    private String registType;

    private String serviceType;

    private String serviceYn;

    private String source;

    private String subtitle;

    private String thumbnailFileName;

    private String thumbnailFilePath;

    private String title;

    private String urgency;

    private String weight;

}
