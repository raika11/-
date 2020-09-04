package jmnet.moka.core.tps.helper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;

public class ApiCodeHelper {

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * <pre>
     * apiCodeId (공통코드) -> apiHost, apiPath
     * </pre>
     * 
     * @param request 요청
     * @param etccodes API타입의 공통코드 목록
     * @param apiCodeId 공통코드
     * @return apiHost, apiPath
     * @throws InvalidDataException apiCodeId 가 공통코드에 없음 에러
     */
    public Map<String, String> getDataApi(HttpServletRequest request, List<Etccode> etccodes,
            String apiCodeId) throws InvalidDataException {

        Optional<Etccode> etccode = etccodes.stream().filter(code -> {
            String codeId = code.getCodeId();
            return apiCodeId.equalsIgnoreCase(codeId) ? true : false;
        }).findFirst();

        Map<String, String> returnMap = new HashMap<String, String>();
        if (etccode.isPresent()) {
            returnMap.put(TpsConstants.API_HOST, etccode.get().getCodeNameEtc1());
            returnMap.put(TpsConstants.API_PATH, etccode.get().getCodeNameEtc2());
        } else {
            InvalidDataDTO validDto = new InvalidDataDTO("apiCodeId",
                    messageByLocale.get("tps.dataset.error.invalid.apiCodeId", request));
            String validMessage = messageByLocale.get("tps.common.error.invalidSearch", request);
            throw new InvalidDataException(validDto, validMessage);
        }

        return returnMap;
    }

    /**
     * apiHost, apiPath -> apiCodeId (공통코드)
     * 
     * @param etccodes API타입의 공통코드 목록
     * @param dsApiHost apiHost
     * @param dsApiPath apiPath
     * @return 공통코드 PK
     */
    public String getDataApiCode(List<Etccode> etccodes, String dsApiHost, String dsApiPath) {
        if (dsApiHost == null || dsApiPath == null)
            return null;

        Optional<Etccode> etccode = etccodes.stream().filter(code -> {
            return dsApiHost.equalsIgnoreCase(code.getCodeNameEtc1())
                    && dsApiPath.equalsIgnoreCase(code.getCodeNameEtc2()) ? true : false;
        }).findFirst();
        if (etccode.isPresent()) {
            return etccode.get().getCodeId();
        }
        return null;
    }
}
