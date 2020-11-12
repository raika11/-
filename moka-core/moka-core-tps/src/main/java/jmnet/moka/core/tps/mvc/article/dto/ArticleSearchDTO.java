package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("ArticleSearchDTO")
public class ArticleSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 6774193298696439472L;

    //    private String sourceCode;

    public ArticleSearchDTO() {
        super(ArticleBasicVO.class, "totalId,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        //        this.sourceCode=TpsConstants.SEARCH_TYPE_ALL;
    }
}
