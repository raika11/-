package jmnet.moka.core.tps.mvc.desking.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 작업자 관련편집기사 정보
 * 
 * @author ohtah
 *
 */
@Alias("DeskingRelWorkVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeskingRelWorkVO implements Serializable {

    private static final long serialVersionUID = 2913799806670482970L;

    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    @Column(name = "CONTENTS_ID")
    private String contentsId;

    @Column(name = "REL_CONTENTS_ID")
    private String relContentsId;

    @Column(name = "REL_ORDER")
    private Integer relOrder;

    @Column(name = "REL_TITLE")
    private String relTitle;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

}
