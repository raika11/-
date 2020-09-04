package jmnet.moka.core.tps.mvc.desking.dto;

import java.io.Serializable;
import javax.persistence.Column;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 데스킹워크DTO
 * 
 * @author jeon0525
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeskingWorkDTO implements Serializable {

    private static final long serialVersionUID = -6709195199525259062L;

    private Long seq;

    private Long deskingSeq;

    private String creator;

    private Long datasetSeq;

    private Long editionSeq;

    private String contentsId;

    private String contentsAttr;

    private String lang;

    private String distYmdt;

    private Integer contentsOrder;

    @Column(name = "TITLE")
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

    private String createYmdt;

    private Integer pvCount;

    private Integer uvCount;

    @JsonIgnore
    private MultipartFile thumbnailFile;

    private Long componentSeq;

    //    private Set<DeskingRelWorkDTO> deskingRelWorkDTO;
}
