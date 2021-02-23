package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import jmnet.moka.web.rcv.util.RcvJsonUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.jamxml.vo
 * ClassName : JamArticleMultiOvpVo
 * Created : 2021-02-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-17 017 오후 3:51
 */

@Getter
@Setter
@ToString
public class ItemMultiOvpVo implements Serializable {
    private static final long serialVersionUID = 3816835823783374607L;

    private long ovpId;                  // OVP_ID
    private String adYn;                // 광고 여부
    private String reuseYn;             // - 재사용 여부
    private String ovpTitle;            // 제목
    private String ovpDesc;             // 설명
    private String duration;            // 재생시간
    private String tagList;             // 태그 리스트(,로 구분)
    private String imgUrl;              // 이미지 URL
    private String fileSize;            // 파일 사이즈
    private String ratio;               // - 영상비률
    private String origin;              // - 출처
    private String mediaSource;         // 영상 소스 출처(직접촬영, JTBC, 외부 등)
    private String mediaForm;           // 영상유형(촬영, 인터뷰, 제보 등)
    private String mediaGenre;          // 영상 분류(속보, 연재, 기획, 기타)
    private String category;            // 영상 카테고리
    private String relIssue;            // 연관 이슈
    private String periodYn;            // - 기간내 사용 여부
    private String sDate;               // - 기간 사용 시작일
    private String eDate;               // - 기간 사용 종료일
    private String regId;               // 등록자 ID
    private String regName;             // 등록자 이름
    private ItemVo item;

    public ItemMultiOvpVo(JSONObject jsonObject, long ovpId, ItemVo item)
            throws JSONException {
        this.item = item;
        this.ovpId = ovpId;
        this.ovpTitle = RcvJsonUtil.getJsonString( jsonObject, "name");
        this.ovpDesc = RcvJsonUtil.getJsonString( jsonObject, "description");
        this.duration = RcvJsonUtil.getJsonString( jsonObject, "duration");

        JSONObject customFields = RcvJsonUtil.getJsonObject(jsonObject, "custom_fields");
        if( customFields != null ) {
            this.adYn = RcvJsonUtil.getJsonString( customFields, "atpn_ad_yn");
            this.reuseYn = RcvJsonUtil.getJsonString( customFields, "atpn_reusprhibt_yn");
            this.fileSize = RcvJsonUtil.getJsonString( customFields, "file_size");
            this.ratio = RcvJsonUtil.getJsonString( customFields, "media_ratio");
            this.origin = RcvJsonUtil.getJsonString( customFields, "origin");
            this.mediaSource = RcvJsonUtil.getJsonString( customFields, "media_source");
            this.mediaForm = RcvJsonUtil.getJsonString( customFields, "media_form");
            this.mediaGenre = RcvJsonUtil.getJsonString( customFields, "media_genre");
            this.category = RcvJsonUtil.getJsonString( customFields, "media_category");
            this.periodYn = RcvJsonUtil.getJsonString( customFields, "use_pd_sttus_cd");
            this.sDate = RcvJsonUtil.getJsonString( customFields, "use_pd_begindt");
            this.eDate = RcvJsonUtil.getJsonString( customFields, "use_pd_enddt");
            this.regId = RcvJsonUtil.getJsonString( customFields, "user_id");
            this.regName = RcvJsonUtil.getJsonString( customFields, "user_name");
            this.relIssue = RcvJsonUtil.getJsonString( customFields, "issue");
        }

        JSONArray tagArray = RcvJsonUtil.getJsonArray(jsonObject, "tags");
        if( tagArray != null ){
            tagList = tagArray.join(",");
        }

        JSONObject images = RcvJsonUtil.getJsonObject(jsonObject, "images");
        if( images != null ) {
            JSONObject poster = RcvJsonUtil.getJsonObject(images, "poster");
            if( poster != null ){
                this.imgUrl = RcvJsonUtil.getJsonString(poster, "src");
            }
        }
    }
}