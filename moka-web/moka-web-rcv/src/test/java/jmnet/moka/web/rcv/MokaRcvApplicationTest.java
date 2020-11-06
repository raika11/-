package jmnet.moka.web.rcv;

import jmnet.moka.web.rcv.util.RcvImageUtil;
import org.junit.Test;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv
 * ClassName : MokaRcvApplicationTest
 * Created : 2020-10-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-26 026 오후 2:40
 */
public class MokaRcvApplicationTest {
    @Test
    public void combineWatermarkImage() {
        final String watermarkUrl = "https://images.joins.com/ui_joongang/news/pc/star/1001/watermark.png";
        final String imageUrl = "https://pds.joins.com/news/component/htmlphoto_mmdata/202009/08/129d5056-4535-45d6-91f6-43f38de12b33.jpg";
        final String targetImage = "/box/combineImage.jpg";

        RcvImageUtil.combineWatermarkImage(targetImage, imageUrl, watermarkUrl );
    }

    /*
    @Test
    public void loadJamArticleVo()
            throws JAXBException, XMLStreamException {
        final String fileName =
                "C:\\중앙일보\\JAM 수신 소스\\JAM 소스\\Joongang.JCMS.Receive.Web\\ReceiveData\\Joongang_Jopan\\Comp\\202009\\08\\1_820114_20200908050028.xml";
        File file = new File(fileName);
        JamArticleVo jamArticleVo = (JamArticleVo) JaxbObjectManager.getBasicVoFromXml(file, JamArticleVo.class);
    }
     */
}
