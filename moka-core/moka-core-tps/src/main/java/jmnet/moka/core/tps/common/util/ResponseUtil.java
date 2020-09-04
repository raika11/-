/**
 * msp-tps WriteResultUtil.java 2020. 1. 10. 오후 3:45:10 ssc
 */
package jmnet.moka.core.tps.common.util;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultHeaderDTO;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;

/**
 * <pre>
 * 
 * 2020. 1. 10. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 10. 오후 3:45:10
 * @author ssc
 */
public class ResponseUtil {

    /**
     * Response에 에러메세지를 JSON으로 내려준다.
     * 
     * @param response 응답객체
     * @param resultCode 에러코드
     * @param message 에러메세지
     * @throws IOException 예외
     */
    public static void error(HttpServletResponse response, int resultCode, String message)
            throws IOException {

        write(response, getErrorResultDTO(response, resultCode, message));
    }

    /**
     * Response에 에러메세지를 JSON으로 내려준다.
     * 
     * @param response 응답객체
     * @param resultCode 에러코드
     * @param message 에러메세지
     * @throws IOException 예외
     */
    public static ResultDTO<String> getErrorResultDTO(HttpServletResponse response, int resultCode,
            String message) {

        setDefault(response);

        ResultHeaderDTO header = new ResultHeaderDTO();
        header.setSuccess(false);
        header.setResultCode(resultCode);
        header.setMessage(message);
        ResultDTO<String> resultDTO = new ResultDTO<String>(header, "");

        return resultDTO;
    }

    public static <T> ResponseEntity<?> getErrorResponseEntity(HttpServletResponse response,
            int resultCode, String message) {

        return new ResponseEntity<>(getErrorResultDTO(response, resultCode, message),
                HttpStatus.OK);
    }

    public static <T> ResponseEntity<?> getErrorResponseEntity(HttpServletResponse response,
            int resultCode, String message, T body) {

        setDefault(response);

        ResultHeaderDTO header = new ResultHeaderDTO();
        header.setSuccess(false);
        header.setResultCode(resultCode);
        header.setMessage(message);
        ResultDTO<T> resultDTO = new ResultDTO<T>(header, body);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * Response에 에러메세지를 JSON으로 내려준다. body에 에러목록을 넣는다.
     * 
     * @param response 응답객체
     * @param resultCode 에러코드
     * @param message 에러메세지
     * @param body 에러목록
     * @throws IOException 예외
     */
    public static <T> void error(HttpServletResponse response, int resultCode, String message,
            T body) throws IOException {

        setDefault(response);

        ResultHeaderDTO header = new ResultHeaderDTO();
        header.setSuccess(false);
        header.setResultCode(resultCode);
        header.setMessage(message);
        ResultDTO<T> resultDTO = new ResultDTO<T>(header, body);

        write(response, resultDTO);
    }

    /**
     * Response에 성공메세지를 JSON으로 내려준다.
     * 
     * @param response 응답객체
     * @param resultCode 에러코드
     * @param message 에러메세지
     * @param redirect redirect url
     * @param body 에러목록
     * @throws IOException 예외
     */
    public static void ok(HttpServletResponse response, String message, String redirect)
            throws IOException {

        setDefault(response);

        ResultHeaderDTO header = new ResultHeaderDTO();
        header.setSuccess(true);
        header.setResultCode(TpsConstants.HEADER_SUCCESS);
        header.setMessage(message);
        header.setRedirect(redirect);
        ResultDTO<String> resultDTO = new ResultDTO<String>(header, "");

        write(response, resultDTO);
    }

    private static void setDefault(HttpServletResponse response) {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(TpsConstants.DEFAULT_CHARSET);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private static <T> void write(HttpServletResponse response, ResultDTO<T> resultDTO)
            throws IOException {

        PrintWriter out = response.getWriter();
        out.print(ResourceMapper.getDefaultObjectMapper().writeValueAsString(resultDTO));
        out.flush();
        out.close();
    }
}
