package jmnet.moka.web.bulk.task.bulkdump.vo;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.bulk.common.vo.BasicVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJHotArticle;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo.sub
 * ClassName : BulkDumpJHot
 * Created : 2021-02-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-09 009 오전 11:58
 */
@Getter
@Setter
@XmlRootElement(name = "article_list")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkDumpJHot extends BasicVo {
    private static final long serialVersionUID = 4910201220744040878L;

    @XmlElement(name = "article")
    private List<BulkDumpJHotArticle> articles;
}
