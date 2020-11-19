package jmnet.moka.web.rcv.task.cppubxml.vo;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cppubxml.vo
 * ClassName : CpPubXmlFileName
 * Created : 2020-11-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-17 017 오후 2:14
 */
@Getter
@Setter
@XmlRootElement(name = "Characteristics")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpPubXmlFileName implements Serializable {
    private static final long serialVersionUID = 9162890749217247662L;

    private String media;
    private String section;
    private String date;
    private String pan;
    private String type;
    private String myun;
    private String local;
    private String revision;

    private String sectionName;
    private String mCode;
    private String typeName;

    private boolean passProcess;
    private String passReason;

    @SuppressWarnings({"ConstantConditions", "LoopStatementThatDoesntLoop"})
    public boolean doFilenameParse(String fileName, String sourceCode) {
        do {
            String[] split = fileName.split("_");
            if (split.length < 4) {
                break;
            }
            if (split[0].length() < 9) {
                break;
            }
            this.media = split[0].substring(0, 4);
            this.section = split[0].substring(4, 9);

            if (split[1].length() < 8) {
                break;
            }
            this.date = split[1].substring(0, 8);

            if (split[2].length() < 7) {
                break;
            }
            this.pan = split[2].substring(0, 2);
            this.type = split[2].substring(2, 4);
            this.myun = split[2]
                    .substring(4, 7)
                    .substring(1, 3);

            this.local = split[3];
            if (split.length > 4) {
                this.revision = split[4];
            } else {
                this.revision = "";
            }

            this.sectionName = "";
            this.mCode = "";
            this.typeName = "";

            switch (sourceCode) {
                case "1":
                    return doFilenameParseJoongangJopan();
                case "60":
                    return doFilenameParseJoongangSunday();
            }
            return true;
        } while (false);

        return false;
    }

    @SuppressWarnings("SameReturnValue")
    private boolean doFilenameParseJoongangSunday() {
        // 중앙선데이만 처리한다. 이외것들은 로그남기고 완료폴더로 이동한다.
        if (media.compareTo("W005") != 0) {
            this.passProcess = true;
            setPassReason("중앙선데이만 처리한다. 이외것들은 로그남기고 완료폴더로 이동한다.");
            return true;
        }

        this.passProcess = false;

        switch (section) {
            case "W5001":
            case "W5005":
                this.sectionName = "종합";
                break;
            case "W5002":
                this.sectionName = "경제";
                break;
            case "W5003":
            case "W5006":
                this.sectionName = "스페셜";
                break;
            case "W5004":
            case "W5007":
                this.sectionName = "매거진";
                break;
            default:
                this.sectionName = section;
                break;
        }

        switch (type) {
            case "00":
            case "19":
                this.typeName = "뉴스";
                break;
            case "12":
            case "21":
                this.typeName = "매거진";
                break;
            case "18":
            case "20":
                this.typeName = "스페셜";
                break;
            default:
                this.typeName = type;
                break;
        }

        return true;
    }

    @SuppressWarnings("SameReturnValue")
    private boolean doFilenameParseJoongangJopan() {
        // 중앙일보 조판이면서, 제주기사가 아닌것만 처리한다. 이외것들은 로그남기고 완료폴더로 이동한다.
        // If sArticleMetaMedia = "D001" And sArticleMetaLocal <> "D1018" And sArticleMetaPan <> "05" Then
        // If (sArticleMetaMedia = "D001" And sArticleMetaLocal <> "D1018" And sArticleMetaPan <> "05") Or (sArticleMetaMedia = "W006" And (sArticleMetaMyun = "01" And sArticleMetaPan = "42") Or (sArticleMetaMyun <> "01" And sArticleMetaPan = "41")) Then
        // 위 라이프트랜드 1면이 안들어온다는 문의가 자주와서 위 라이프트랜드 조건 없애버렸다 (20160404 : jaeils)

        if (!((this.media.compareTo("D001") == 0 && this.local.compareTo("D1018") != 0 && this.pan.compareTo("05") != 0) || (
                this.media.compareTo("W006") == 0))) {
            this.passProcess = true;
            setPassReason("중앙일보 조판이면서, 제주기사가 아닌것만 처리한다. 이외것들은 로그남기고 완료폴더로 이동한다.");
            return true;
        }

        // 중앙일보 10판 이상, 서울/수도권
        if(!(this.media.compareTo("D001") == 0 && (this.local.compareTo("D1001") == 0 || this.local.compareTo("D1002") == 0)
                && this.pan.compareTo("05") != 0)) {
            this.passProcess = true;
            setPassReason("중앙일보 10판 이상, 서울/수도권만 처리한다. 이외것들은 로그남기고 완료폴더로 이동한다.");
            return true;
        }

        this.passProcess = false;

        switch (this.section) {
            case "D1001":
                this.sectionName = "종합";
                this.mCode = "A";
                break;
            case "D1002":
                this.sectionName = "기타";
                this.mCode = "B";
                break;
            case "D1003":
                this.sectionName = "광고특집";
                this.mCode = "C";
                break;
            case "D1004":
                this.sectionName = "기타";
                this.mCode = "D";
                break;
            case "D1005":
                this.sectionName = "중앙경제";
                this.mCode = "E";
                break;
            case "D1006":
                this.sectionName = "기타";
                this.mCode = "F";
                break;
            case "D1007":
                this.sectionName = "틴틴경제";
                this.mCode = "T";
                break;
            case "D1008":
                this.sectionName = "기타";
                this.mCode = "H";
                break;
            case "D1009":
                this.sectionName = "기타";
                this.mCode = "I";
                break;
            case "D1010":
                this.sectionName = "다면특집";
                this.mCode = "J";
                break;
            case "D1011":
                this.sectionName = "키자니아";
                this.mCode = "K";
                break;
            case "D1012":
                this.sectionName = "배터라이프";
                this.mCode = "L";
                break;
            case "D1013":
                this.sectionName = "매거진M";
                this.mCode = "M";
                break;
            case "D1014":
                this.sectionName = "기타";
                this.mCode = "N1";
                break;
            case "D1015":
                this.sectionName = "기타";
                this.mCode = "O";
                break;
            case "D1016":
                this.sectionName = "프리미엄";
                this.mCode = "P";
                break;
            case "D1017":
                this.sectionName = "타블-NEGA";
                this.mCode = "N";
                break;
            case "D1018":
                this.sectionName = "기타";
                this.mCode = "R";
                break;
            case "D1019":
                this.sectionName = "스포츠";
                this.mCode = "S";
                break;
            case "D1020":
                this.sectionName = "기타";
                this.mCode = "T1";
                break;
            case "D1021":
                this.sectionName = "특집";
                this.mCode = "U";
                break;
            case "D1022":
                this.sectionName = "예비";
                this.mCode = "V";
                break;
            case "D1023":
                this.sectionName = "기타";
                this.mCode = "W1";
                break;
            case "D1024":
                this.sectionName = "일보보관";
                this.mCode = "X";
                break;
            case "D1025":
                this.sectionName = "타블로이드";
                this.mCode = "Y";
                break;
            case "D1026":
                this.sectionName = "주말섹션";
                this.mCode = "W";
                break;
            case "W8001":
                this.sectionName = "JJ섹션";
                this.mCode = "J";
                break;
            case "W6001":
                this.sectionName = "라이프트랜드";
                this.mCode = "Q";
                break;
            default:
                this.sectionName = "기타";
                this.mCode = "Z";
                break;
        }

        switch (type) {
            case "00":
                this.typeName = "뉴스";
                break;
            case "12":
                this.typeName = "매거진";
                break;
            case "18":
                this.typeName = "스페셜";
                break;
            default:
                this.typeName = type;
                break;
        }

        return true;
    }
}
