package jmnet.moka.web.bulk.task.bulkdump.process.joongang;

import java.net.URLConnection;
import java.util.List;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkArticle;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.MediaFullName;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsMMDataVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpNewsVo;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.joongang
 * ClassName : BulkJoongangArticleEx
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 2:05
 */
@Getter
@Setter
@Slf4j
public class BulkJoongangArticleEx extends BulkArticle {
    private static final long serialVersionUID = -8044614923572151886L;

    public BulkJoongangArticleEx(TotalVo<BulkDumpTotalVo> totalVo) {
        super(totalVo);
    }

    @SuppressWarnings("DuplicatedCode")
    @Override
    public void processBulkDumpNewsVo(BulkDumpNewsVo newsVo, List<BulkDumpNewsMMDataVo> bulkDumpNewsMMDataList) {
        super.processBulkDumpNewsVo(newsVo, bulkDumpNewsMMDataList);

        getTotalId().setData(newsVo.getContentId());
        getTotalId10().setData(String.format("%010d", BulkUtil.parseInt(newsVo.getContentId())));
        getOrgSourceCode().setData(newsVo.getOrgSourceCode());
        getMedia1().setData(newsVo.getDep());
        getContCode1().setData(newsVo.getContCode1());
        getContCode2().setData(newsVo.getContCode2());
        getContCode3().setData(newsVo.getContCode3());

        getTitle().setData(newsVo.getTitle());
        getSubTitle().setData(newsVo.getSubTitle());
        getArtReporter().setData(newsVo.getArtReporter());

        getContentHtml().setData(newsVo.getContent());

        getServiceurl().setData(newsVo.getServiceUrl());
        getAddr().setData(newsVo.getAddr());
        getLat().setData(newsVo.getLat());
        getLng().setData(newsVo.getLng());

        getMyun().setData(newsVo.getMyun());
        getPan().setData(newsVo.getPan());
        getContentType().setData(newsVo.getContentType());

        setImageBulkFlag(newsVo.getImageBulkFlag());

        if( getIud().toString().equals("D") )
            setBulkDelSite(newsVo.getDelSite());
        else
            setBulkSendSite(newsVo.getBulkSite()); // 전송매체 리스트  "1:네이버", "2:다음", "3:네이트", "4:줌", "9:기타"
    }

    public void processMediaFullName() {
        getMediaFullName().setData(MediaFullName.getJoongangMediaFullName( getTargetCode().substring(getTargetCode().length() - 1)));
    }

    public String processContent_ImageBlock_GetMimeType(String fileName) {
        return URLConnection.guessContentTypeFromName(fileName);
    }

    public void processContent_ImageBlock() {
        for( BulkDumpNewsMMDataVo mmData : this.getBulkDumpNewsImageList()) {
            final String imgName = FilenameUtils.getName( mmData.getUrl() );
            final String mimeType = processContent_ImageBlock_GetMimeType( imgName );

            getImageBlockTxt2().addDelimiterConcat(mmData.getUrl(), ";");

            getImageBlockXml().concat("<images>\r\n");
            getImageBlockXml().concat("\t<imageurl><![CDATA[" + mmData.getUrl() + "]]></imageurl>\r\n");
            getImageBlockXml().concat("\t<description><![CDATA[" + mmData.getDescription() + "]]></description>\r\n");
            getImageBlockXml().concat("</images>\r\n");

            getImageBlockXmlEx().concat("<images>\r\n");
            getImageBlockXmlEx().concat("\t<imageurl><![CDATA[" + imgName + "]]></imageurl>\r\n");
            getImageBlockXmlEx().concat("\t<description><![CDATA[" + mmData.getDescription() + "]]></description>\r\n");
            getImageBlockXmlEx().concat("</images>\r\n");

            getImageBlockXml2().concat("<IMG>\r\n");
            getImageBlockXml2().concat("\t<URL><![CDATA[" + mmData.getUrl() + "]]></URL>\r\n");
            getImageBlockXml2().concat("\t<TITLE><![CDATA[" + mmData.getDescription() + "]]></TITLE>\r\n");
            getImageBlockXml2().concat("</IMG>\r\n");

            getImageBlockXml3().concat("<AppendData mimetype=\"" + mimeType + "\">\r\n");
            getImageBlockXml3().concat("\t<Title><![CDATA[" + mmData.getDescription() + "]]></Title>\r\n");
            getImageBlockXml3().concat("\t<Caption><![CDATA[" + mmData.getDescription() + "]]></Caption>\r\n");
            getImageBlockXml3().concat("\t<URL><![CDATA[" + mmData.getUrl() + "]]></URL>\r\n");
            getImageBlockXml3().concat("\t<BodyImgYN>Y</BodyImgYN>\r\n");
            getImageBlockXml3().concat("</AppendData>\r\n");

            getImageBlockXml4().concat("<component>\r\n");
            getImageBlockXml4().concat("\t<type>I</type>\r\n");
            getImageBlockXml4().concat("\t<url><![CDATA[" + mmData.getUrl() + "]]></url>\r\n");
            getImageBlockXml4().concat("\t<desc><![CDATA[" + mmData.getDescription() + "]]></desc>\r\n");
            getImageBlockXml4().concat("\t<width />\r\n");
            getImageBlockXml4().concat("\t<height />\r\n");
            getImageBlockXml4().concat("\t<etc><![CDATA[]]></etc>\r\n");
            getImageBlockXml4().concat("</component>\r\n");
        }
    }
}
