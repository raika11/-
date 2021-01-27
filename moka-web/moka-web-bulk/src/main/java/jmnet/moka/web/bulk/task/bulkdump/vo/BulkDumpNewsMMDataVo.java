package jmnet.moka.web.bulk.task.bulkdump.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumpNewsMMDataVo
 * Created : 2021-01-19 019 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-19 019 오후 3:57
 */
@Getter
@Setter
public class BulkDumpNewsMMDataVo implements Serializable {
    private static final long serialVersionUID = -6936262730838068886L;

    @JsonProperty(value = "SEQ_NO")
    private String seqNo;

    @JsonProperty(value = "MULTI_TYPE")
    private String multiType;

    @JsonProperty(value = "URL")
    private String url;

    @JsonProperty(value = "DESCRIPTION")
    private String description;

    @JsonProperty(value = "ASSET_ID")
    private String assetId;

    @JsonProperty(value = "IS_SRC")
    private int isSrc;

    @JsonProperty(value = "IMAGEBULK_FLAG")
    private String imageBulkFlag;

    private String videoUrl;
    private String videoId;
    private String downloadFileName;
}
