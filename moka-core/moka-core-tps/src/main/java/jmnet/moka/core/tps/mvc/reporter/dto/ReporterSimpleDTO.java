package jmnet.moka.core.tps.mvc.reporter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

/**
 * <pre>
 * 기자일련번호, 아이디, 소속, 이메일, 노출여부, url link
 * 2020. 11. 09. obiwan 최초생성
 * </pre>
 *
 * @since 2020. 11. 09. 오후 4:46:30
 * @author obiwan
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReporterSimpleDTO implements Serializable {

    private static final long serialVersionUID = -7979684085879328911L;

    public static final Type TYPE = new TypeReference<List<ReporterSimpleDTO>>() {}.getType();

    private String repSeq;

    private String usedYn;

    private String talkYn;

    private String repName;

    private String repEmail1;

    private String repEmail2;

    private String repTitle;

    private String repPhone;

    private String joinsId;

    private String jnetId;

    private String repPhoto;

    private String repImg;

    private String snsTw;

    private String snsFb;

    private String snsIn;

    private String joinsBlog;

    private String viewCnt;

    private String artCnt;

    private String scbCnt;

    private String shrCnt;

    private String replyCnt;

    private String jplusRepDiv;

    private String jplusJobInfo;

    private String jplusTitle;

    private String jplusMemo;

    private String jplusProfileYn;

    private String jplusRegDt;

    private String jplusUsedYn;

    private String r1Cd;

    private String r2Cd;

    private String r3Cd;

    private String r4Cd;

    private String r5Cd;

    private String r6Cd;

    private String jamRepSeq;

    private String jamDeptSeq;

    private String jamDeptNm;

    private String repField;

    private String jamComCd;

    private String jamComNm;

    private String regDt;

    private String regId;

    private String modDt;

    private String modId;

    private String repTalk;

    private String userTalk;
}
