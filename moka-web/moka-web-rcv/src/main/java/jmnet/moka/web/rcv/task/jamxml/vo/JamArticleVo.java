package jmnet.moka.web.rcv.task.jamxml.vo;

import java.util.List;
import javax.xml.bind.JAXBException;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.object.JaxbObjectManager;
import jmnet.moka.web.rcv.common.object.JaxbObjectUnmarshallerImpl;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ArticleIdVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ArticlePropVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.CategoryVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ContentsVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.CoverImgVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.EtcInfoVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.GeoLocVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.MediaCodeVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.PaperPropVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ReporterVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.WorkerInfoVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo
 * ClassName : JamArticleVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오전 9:32
 */
@Getter
@Setter
@XmlRootElement(name = "article")
@XmlAccessorType(XmlAccessType.FIELD)
public class JamArticleVo extends BasicVo {
    private static final long serialVersionUID = 4233258273211512229L;

    @XmlAttribute(name = "art_type")
    private String artType;

    @XmlAttribute(name = "tmpl_type")
    private String tmplType;

    @XmlElement(name = "media_code")
    private MediaCodeVo mediaCode;

    @XmlElement(name = "iud")
    private String iud;

    @XmlElement(name = "id")
    private ArticleIdVo id;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "pc_title")
    private String pcTitle;

    @XmlElement(name = "mo_title")
    private String moTitle;

    @XmlElement(name = "list_title")
    private String listTitle;

    @XmlElement(name = "sub_title")
    private String subTitle;

    @XmlElement(name = "contents")
    private ContentsVo contents;

    @XmlElement(name = "sub_contents")
    private ContentsVo subContents;

    @XmlElement(name = "cover_img")
    private CoverImgVo coverImg;

    @XmlElement(name = "article_prop")
    private ArticlePropVo articleProp;

    @XmlElement(name = "paper_prop")
    private PaperPropVo paperProp;

    @XmlElement(name = "geo_loc")
    private GeoLocVo geoLoc;

    @XmlElement(name = "etc_info")
    private EtcInfoVo etcInfo;

    @XmlElementWrapper(name = "reporters")
    @XmlElement(name = "reporter")
    private List<ReporterVo> reporters;

    @XmlElementWrapper(name = "categories")
    @XmlElement(name = "category")
    private List<CategoryVo> categoies;

    @XmlElementWrapper(name = "keywords")
    @XmlElement(name = "tag")
    private List<String> keywords;

    @XmlElement(name = "worker_info")
    private WorkerInfoVo workerInfo;

    public String getReporterJcmsRepSeqList() {
        String sRet = "";
        for (ReporterVo report : reporters) {
            if (!McpString.isNullOrEmpty(sRet)) {
                sRet = sRet.concat(",");
            }
            sRet = sRet.concat(report.getJcmsRepSeq());
        }
        return sRet;
    }

    public String getKeywordTagList() {
        String sRet = "";
        for (String tag : keywords) {
            if (!McpString.isNullOrEmpty(sRet)) {
                sRet = sRet.concat(",");
            }
            sRet = sRet.concat(tag);
        }
        return sRet;
    }
}
