package jmnet.moka.web.rcv.task.jamxml.process;

import jmnet.moka.common.utils.McpString;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.jamxml
 * ClassName : JamXmlCodeConverter
 * Created : 2020-11-24 024 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-24 024 오전 10:29
 */
public class XmlGenCodeConverter {
    public static String convertSectionCode(String mediaCode, String section) {
        if (McpString.isNullOrEmpty(section)) {
            return "";
        }

        if (mediaCode.equals("61")) {
            return section.substring(0, 1).concat(section.substring(section.length() - 1));
        } else if ( !mediaCode.equals("1") ) {
            return "";
        }

        switch (section) {
            case ("D1001"):
                return "A"; // "종합"
            case ("D1002"):
                return "B"; // "기타";
            case ("D1003"):
                return "C"; // "광고특집";
            case ("D1004"):
                return "D"; // "기타";
            case ("D1005"):
                return "E"; // "중앙경제";
            case ("D1006"):
                return "F"; // "기타";
            case ("D1007"):
                return "T"; // "틴틴경제";
            case ("D1008"):
                return "H"; // "기타";
            case ("D1009"):
                return "I"; // "기타";
            case ("D1010"):
                return "J"; // "다면특집";
            case ("D1011"):
                return "K"; // "키자니아";
            case ("D1012"):
                return "L"; // "배터라이프";
            case ("D1013"):
                return "M"; // "매거진M";
            case ("D1014"):
                return "N1"; // "기타";
            case ("D1015"):
                return "O"; // "기타";
            case ("D1016"):
                return "P"; // "프리미엄";
            case ("D1017"):
                return "N"; // "타블-NEGA";
            case ("D1018"):
                return "R"; // "기타";
            case ("D1019"):
                return "S"; // "스포츠";
            case ("D1020"):
                return "T1"; // "기타";
            case ("D1021"):
                return "U"; // "특집";
            case ("D1022"):
                return "V"; // "예비";
            case ("D1023"):
                return "W1"; // "기타";
            case ("D1024"):
                return "X"; // "일보보관";
            case ("D1025"):
                return "Y"; // "타블로이드";
            case ("D1026"):
                return "W"; // "주말섹션";
            case ("W8001"):
                return "J"; // "JJ섹션";
            case ("W6001"):
                return "Q"; // "라이프트랜드";
            default:
                return "Z"; // "기타";
        }
    }
}
