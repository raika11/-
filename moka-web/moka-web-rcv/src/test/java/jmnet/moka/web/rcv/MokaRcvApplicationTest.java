package jmnet.moka.web.rcv;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import jmnet.moka.web.rcv.common.object.JaxbObjectManager;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleListVo;
import jmnet.moka.web.rcv.util.RcvImageUtil;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
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
@Slf4j
public class MokaRcvApplicationTest {
    @Test
    public void patternFile() {
        String sInput = "C:\\중앙일보\\수신서버 소스\\cp_list.xml";
        String sWildcard = "*.xml";

        if (FilenameUtils.wildcardMatch(sInput, sWildcard)) {
            log.info("arrived !!");
        }
    }
    /*
    @Test
    public void patternText() {
        String sInput = "<![CDATA[>> 5면 <EC37>뉴딜<0038>펀드<EC38>로 계속,<3800> <ec38>관계기사 ●면]]>";

        Pattern pattern = Pattern.compile("(<[0-9A-Fa-f]{4}>)");
        Set<String> list = new HashSet<>();
        Matcher m = pattern.matcher(sInput);
        while (m.find()) {
            list.add(m.group());
        }

        for (String s : list) {
            final String replace = String.format("&#%d", Integer.parseInt(s.substring(1, 5), 16));
            log.debug("change Hexa Code  {} ->  {}", s, replace);
            sInput = sInput.replace(s, replace);
        }
        log.debug("{}", sInput);
    }
    /*
    @Test
    public void removeLastReturn() {
        String text = " \n\r\n";

        for (int i = text.length() - 1; i >= 0 ; i-- ) {
            if( text.charAt(i--) != '\n' )
                break;
            if( i < 0 ) break;
            if( text.charAt(i) != '\r' )
                break;
            text = text.substring(0, i);
        }
    }

    /*
    @Test
    public void replaceAllTest() {
        /*
        String input = "<br  ><br/>  dsfsdf <BR/>";
        String output = input.replaceAll( "(?i)<br( *)(/*)>", "<br />");

        input =  "[테스트] ‧ ";
        output = RcvUtil.cpReplaceInsertData(input);
         */
/*
        String testText = "TestTest<iframe src=\"http://serviceapi.rmcnmv.naver.com/1.jpg> &--& </iframe>TestTest";
        testText = testText.concat("TestTest<iframe src=\"http://serviceapi.rmcnmv.naver.com/1.jpg> &-&&-& </iframe>TestTest");

        final String findStart = "<iframe src=\"http://serviceapi.rmcnmv.naver.com/";
        final String findEnd = "</iframe>";

        int findPos = testText.length();
        do {
            final int startPos = testText.lastIndexOf(findStart, findPos);
            if (startPos == -1) {
                break;
            }

            final int endPos = testText.indexOf(findEnd, startPos + 1);
            if (endPos == -1) {
                break;
            }

            testText = testText
                    .substring(0, startPos)
                    .concat(testText
                            .substring(startPos)
                            .replace("&", "&amp;"));

            findPos = startPos - 1;
        } while (findPos > 0);

    }

    /*
    @Test
    public void loadCpArticleVo()
            throws JAXBException, XMLStreamException {
        final String fileName =
                "C:\\중앙일보\\XML 샘플\\일반_CP\\20200903122936.xml";
        File file = new File(fileName);
        CpArticleListVo cpArticleVo = (CpArticleListVo) JaxbObjectManager.getBasicVoFromXml(file, CpArticleListVo.class);
    }

    /*
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
