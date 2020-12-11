package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : ArticlePropVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 1:56
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "article_prop")
@XmlAccessorType(XmlAccessType.FIELD)
public class ArticlePropVo implements Serializable {
    private static final long serialVersionUID = 2326956535236661468L;

    @XmlElement(name = "service_date")
    private String serviceDate;

    @XmlElement(name = "embargo")
    private String embargo;

    @XmlElement(name = "login_flag")
    private String loginFlag;

    @XmlElement(name = "adult_flag")
    private String adultFlag;

    @XmlElement(name = "blog_flag")
    private String blogFlag;

    @XmlElement(name = "bulk_flag")
    private BulkFlagVo bulkFlag;

    @XmlElement(name = "bulkimg_flag")
    private String bulkimgFlag;

    @XmlElement(name = "breaking_news")
    private String breakingNews;

    @XmlElement(name = "breaking_news_count")
    private Integer breakingNewsCount;

    @XmlElement(name = "on_the_scene_reporting")
    private String onTheSceneReporting;
}
