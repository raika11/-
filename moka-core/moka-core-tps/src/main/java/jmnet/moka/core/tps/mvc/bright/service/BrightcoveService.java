package jmnet.moka.core.tps.mvc.bright.service;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSaveDTO;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
import jmnet.moka.core.tps.mvc.bright.vo.OvpVO;
import org.springframework.http.ResponseEntity;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.service
 * ClassName : BrightcoveService
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:05
 */
public interface BrightcoveService {

    public ResponseEntity<?> findAllOvp(OvpSearchDTO searchDTO);

    /**
     * OVP 영상 목록 조회 https://apis.support.brightcove.com/cms/references/reference.html#operation/GetVideos
     *
     * @param search 검색객체(페이징)
     * @return OVP영상목록
     * @throws IOException    JSON변환 예외
     * @throws ParseException 날짜변환 예외
     */
    List<OvpVO> findAllVideo(OvpSearchDTO search)
            throws IOException, ParseException;

    /**
     * LIVE 영상목록을 채널별로 조회 https://live.support.brightcove.com/live-api/references/reference.html#operation/GetLiveJobDetails
     *
     * @return OVP영상목록
     * @throws IOException    JSON변환 예외
     * @throws ParseException 날짜변환 예외
     */
    List<OvpVO> findAllLive()
            throws IOException, ParseException;

    /**
     * OVP 파일 저장
     *
     * @param saveDTO 저장 정보
     * @return 저장 결과
     */
    ResponseEntity<?> createVideo(OvpSaveDTO saveDTO);
}
