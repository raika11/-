package jmnet.moka.web.rcv.task.cpxml.vo;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpCategoryVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpComponentVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpOptionalVo;
import jmnet.moka.web.rcv.task.cpxml.vo.sub.CpReporterVo;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cpxml.vo
 * ClassName : CpArticleVo
 * Created : 2020-11-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-10 010 오후 5:00
 */
@Getter
@Setter
@XmlRootElement(name = "article")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpArticleVo implements Serializable {
    private static final long serialVersionUID = 7519589880063709570L;

    @XmlElement(name = "media_code")
    private String mediaCode;

    @XmlElement(name = "media_name")
    private String mediaName;

    @XmlElement(name = "id")
    private String id;

    @XmlElement(name = "iud")
    private String iud;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "subtitle")
    private String subTitle;

    @XmlElement(name = "content")
    private String content;

    @XmlElementWrapper(name = "reporters")
    @XmlElement(name = "reporter")
    private List<CpReporterVo> reporters;

    @XmlElement(name = "pressdatetime")
    private String pressDateTime;

    @XmlElementWrapper(name = "categories")
    @XmlElement(name = "category")
    private List<CpCategoryVo> categoies;

    @XmlElement(name = "myun")
    private String myun;

    @XmlElement(name = "pan")
    private String pan;

    @XmlElement(name = "optional")
    private CpOptionalVo optional;

    @XmlElement(name = "copyright")
    private String copyright;

    @XmlElement(name = "serviceurl")
    private String serviceUrl;

    @XmlElementWrapper(name = "components")
    @XmlElement(name = "component")
    private List<CpComponentVo> components;

    @XmlElementWrapper(name = "taglist")
    @XmlElement(name = "tag")
    private List<String> tags;

    public void doReplaceInsertData(String sourceCode) {
        this.title = RcvUtil.cpReplaceInsertData(this.title);
        this.subTitle = RcvUtil.cpReplaceInsertData(this.subTitle);

        if (this.subTitle.contains("&lt;") && this.subTitle.contains("&gt;")) {
            this.subTitle = this.subTitle
                    .replace("&lt;", "<")
                    .replace("&gt;", ">");
        }

        this.copyright = RcvUtil.cpReplaceInsertData( this.copyright );

        for( CpReporterVo report : this.reporters ) {
            report.setName( RcvUtil.cpReplaceInsertData(report.getName().trim()));
            report.setEtc(RcvUtil.cpReplaceInsertData(report.getEtc()));
        }

        // sSection = ""
        // sEmbargoDate = ""
        // sUrgency = ""
        // sArea = ""
        // sArticleType = ""

        for( CpCategoryVo category : this.categoies ) {
            category.setType( category.getType().trim());
            category.setCode( category.getCode().trim());
            category.setName( RcvUtil.cpReplaceInsertData(category.getName()));
        }

        for( CpComponentVo component : this.components ) {
            component.setType( component.getType().trim());
            if(McpString.isNullOrEmpty(component.getType()))
                component.setType("I");
            component.setUrl( component.getUrl().trim());
            component.setDesc( RcvUtil.cpReplaceInsertData(component.getDesc()));
            component.setEtc( RcvUtil.cpReplaceInsertData(component.getEtc()));
        }

        this.setPressDateTime(this.pressDateTime.replace("-", "")
                                                .replace(":", "")
                                                .replace(" ", ""));



        doReplaceInsertDataContent(sourceCode);
    }
    private void doReplaceInsertDataContent(String sourceCode) {
        this.content = RcvUtil
                .cpReplaceInsertData(this.content)
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"");

        if (sourceCode.compareTo("c5") == 0) {
            // 게임메가 예외처리.. <p>로 개행처리 하고있다.
            this.content = this.content
                    .replaceAll("\r", "")
                    .replaceAll("\n", "")
                    .replaceAll("(?i)</p><p", "</p><br /><p");
        } else if (sourceCode.compareTo("d5") == 0) {
            // 네이버에 나가는 동영상 아이프레임 태그 안쪽 & -> &amp;로 변환
            final String findStart = "<iframe src=\"http://serviceapi.rmcnmv.naver.com/";
            final String findEnd = "</iframe>";

            int findPos = this.content.length();
            do {
                final int startPos = this.content.lastIndexOf(findStart, findPos);
                if (startPos == -1) {
                    break;
                }
                final int endPos = this.content.indexOf(findEnd, startPos + 1);
                if (endPos == -1) {
                    break;
                }
                this.content = this.content
                        .substring(0, startPos)
                        .concat(this.content
                                .substring(startPos)
                                .replace("&", "&amp;"));
                findPos = startPos - 1;
            } while (findPos > 0);
        } else if (sourceCode.compareTo("g6") == 0) {
            this.content = this.content
                    .replaceAll("\r", "")
                    .replaceAll("\n", "");
        } else {
            this.content = this.content.replaceAll("(?i)<br( *)(/*)>", "<br />");
            if (this.content.contains("<br />")) {
                this.content = this.content.replaceAll("\r\n", "");
            } else {
                this.content = this.content
                        .replaceAll("\r\n", "<br />")
                        .replaceAll("\r", "<br />")
                        .replaceAll("\n", "<br />");
            }
        }

        //br을 캐리지리턴으로 변경한다.
        this.content = this.content.replaceAll("(?i)<br( *)(/*)>", "\r\n");

        if (sourceCode.compareTo("c5") == 0) {
            // 부동산
            this.content = this.content
                    .replaceAll("(?i)<br /><br />", "<br />")
                    .replaceAll("(?i)<p>&nbsp;</p>", "")
                    .replaceAll("(?i)&nbsp;", " ")
                    .replaceAll("(?i)(<p>)?(\r?\n|\r)?<table[^>]*>(\r?\n|\r)?<tbody>(\r?\n|\r)?<tr>(\r?\n|\r)?<td[^>]*><img[^>]*src=\"([^>=]*)\"( [^>]*( *)(/*))?>(\r?\n|\r)?</td>(\r?\n|\r)?</tr>(\r?\n|\r)?</tbody>(\r?\n|\r)?</table>",
                            "<div class=\"ab_photo photo_center\"><div class=\"image\"><img alt=\"기사 이미지\" src=\"$6\"><span class=\"mask\"></span></div></div>")
                    .replaceAll("(?i)<div[^>]*><img[^>]*src=\"([^>]*)\"( [^>]*( *)(/*))?>(<p[^>]*>([^>]*)</p>)?</div>",
                            "<div class=\"ab_photo photo_center\"><div class=\"image\"><img alt=\"기사 이미지\" src=\"$1\"><span class=\"mask\"></span></div><p class=\"caption\">$6</p></div>")
                    .replaceAll("(?i)<p class=\"caption\"></p>", "");
        }

        this.content = this.content.replaceAll( "(?i) name=\".*?(.jpg|.jpeg|.gif|.bmp)\"", "" )
                .replace( "&lsquo;", "‘")
                                   .replace( "&rsquo;", "’")
                                   .replace( "&ldquo;", "“")
                                   .replace( "&rdquo;", "”");

        // 기자명/카피라잇을 붙이기위해 하단 개행 싹 지운다.
        for (int i = this.content.length() - 1; i >= 0 ; i-- ) {
            if( this.content.charAt(i--) != '\n' )
                break;
            if( i < 0 ) break;
            if( this.content.charAt(i) != '\r' )
                break;
            this.content = this.content.substring(0, i);
        }

        // 카피라잇 붙이기
        if (sourceCode.compareTo("7") == 0) {
            this.content = this.content.concat("\r\n\r\n<저작권자(c)중앙일보조인스랜드. 무단전제-재배포금지.>");
        } else {
            if( !McpString.isNullOrEmpty(this.copyright) ) {
                this.content = this.content.concat("\r\n\r\n").concat(this.copyright);
            }
        }
    }
}
