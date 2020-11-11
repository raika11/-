package jmnet.moka.web.rcv.task.cpxml.vo;

import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml.vo
 * ClassName : CpArticleListVo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 5:05
 */
@Getter
@Setter
@XmlRootElement(name = "article_list")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpArticleListVo extends BasicVo {
    private static final long serialVersionUID = 1976143109201412553L;

    @XmlElement(name = "article")
    private List<CpArticleVo> articles;
}
