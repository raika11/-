package jmnet.moka.web.bulk.task.bulkdump.vo.sub;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo.sub
 * ClassName : BulkDumpJHotArticle
 * Created : 2021-02-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-09 009 오후 12:01
 */
@Getter
@Setter
@XmlRootElement(name = "article")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkDumpJHotArticle implements Serializable {
    private static final long serialVersionUID = 5382517723021513378L;

    @XmlElement(name = "total_id")
    private String totalId;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "link")
    private String link;
}
