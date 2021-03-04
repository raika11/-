package jmnet.moka.web.bulk.task.bulkdump.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumpVo
 * Created : 2020-12-21 021 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-21 021 오전 11:10
 */
@Getter
@Setter
public class BulkDumpTotalVo implements Serializable {
    private static final long serialVersionUID = -1262311176929063347L;

    @JsonProperty(value = "SEQ_NO")
    private Integer seqNo;

    @JsonProperty(value = "INS_DT")
    private Date insDt;

    @JsonProperty(value = "SOURCE_CODE")
    private String sourceCode;

    @JsonProperty(value = "TARGET_CODE")
    private String targetCode;

    @JsonProperty(value = "IUD")
    private String iud;

    @JsonProperty(value = "CONTENT_ID")
    private Integer contentId;

    @JsonProperty(value = "TITLE")
    private String title;

    @JsonProperty(value = "ORG_SOURCE_CODE")
    private String orgSourceCode;

    @JsonProperty(value = "JHOT_YN")
    private String jHotYn;

    private int dumpStatus;
    private String contentDiv;

    private int dumpLogSeq;

    private String curPortalDiv;
    private String curPortalIud;
    private int curPortalSenderStatus;
    private String curPortalContent;

    private boolean fromWaitQueue;
    private long dumpStartTime = System.currentTimeMillis();

    public BulkDumpTotalVo setFromWaitQueue( boolean fromWaitQueue ) {
        this.fromWaitQueue = fromWaitQueue;
        return this;
    }

    public boolean isDdrefValid() {
        //noinspection ConstantConditions,LoopStatementThatDoesntLoop
        do {
            if( this.seqNo == null )
                break;
            if( this.insDt == null )
                break;
            if( this.sourceCode == null )
                break;
            if( this.targetCode == null )
                break;
            if( this.iud == null )
                break;
            if( this.contentId == null )
                break;
            if( this.orgSourceCode == null )
                break;
            return true;
        }while (false);

        return false;
    }

    public Date getInsDt() {
        return BulkUtil.getDeepDate(insDt);
    }

    @SuppressWarnings("unused")
    public void setInsDt(Date insDt) {
        this.insDt = BulkUtil.getDeepDate(insDt);
    }
}
