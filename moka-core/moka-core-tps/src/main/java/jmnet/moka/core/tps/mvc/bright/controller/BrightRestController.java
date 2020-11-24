package jmnet.moka.core.tps.mvc.bright.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import java.util.HashMap;
import java.util.Map;
import javax.validation.Valid;
import jmnet.moka.core.tps.mvc.bright.dto.DataDto;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
import jmnet.moka.core.tps.mvc.bright.service.BrightcoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api")
public class BrightRestController {

    @Value("${brightcove.jpod.folder-id}")
    private String jpodFolderId;

    @Autowired
    private BrightcoveService brightcoveService;

    @ApiOperation(value = "레스트템플릿")
    @GetMapping("/GetData")
    public ResponseEntity<?> callAPI(@Valid DataDto data)
            throws JsonProcessingException {

        HashMap<String, Object> result = new HashMap<String, Object>();

        String jsonInString = "";

        try {

            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setConnectTimeout(5000); //타임아웃 설정 5초
            factory.setReadTimeout(5000);//타임아웃 설정 5초
            RestTemplate restTemplate = new RestTemplate(factory);

            HttpHeaders header = new HttpHeaders();
            header.set("Content-Type", "application/x-www-form-urlencoded");
            HttpEntity<?> entity = new HttpEntity<>(header);
            String url = "https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials";
            String params = "client_id=" + data.getClientId() + "&client_secret=" + data.getClientSecret();

            UriComponents uri = UriComponentsBuilder
                    .fromHttpUrl(url + "&" + params)
                    .build();

            //이 한줄의 코드로 API를 호출해 MAP타입으로 전달 받는다.
            ResponseEntity<Map> resultMap = restTemplate.exchange(uri.toString(), HttpMethod.POST, entity, Map.class);
            result.put("statusCode", resultMap.getStatusCodeValue()); //http status code를 확인
            result.put("header", resultMap.getHeaders()); //헤더 정보 확인
            result.put("body", resultMap.getBody()); //실제 데이터 정보 확인

            //데이터를 제대로 전달 받았는지 확인 string형태로 파싱해줌
            ObjectMapper mapper = new ObjectMapper();
            jsonInString = mapper.writeValueAsString(resultMap.getBody());

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            result.put("statusCode", e.getRawStatusCode());
            result.put("body", e.getStatusText());
            System.out.println("dfdfdfdf");
            System.out.println(e.toString());

        } catch (Exception e) {
            result.put("statusCode", "999");
            result.put("body", "excpetion오류");
            System.out.println(e.toString());
        }

        return new ResponseEntity<>(jsonInString, HttpStatus.OK);

    }

    @ApiOperation(value = "jpod ovp 목록 조회 예제")
    @GetMapping("/ovp")
    public ResponseEntity<?> getOvpList(OvpSearchDTO ovpSearchDTO)
            throws JsonProcessingException {

        ovpSearchDTO.setFolderId(jpodFolderId);

        return new ResponseEntity<>(brightcoveService.findAllOvp(ovpSearchDTO), HttpStatus.OK);

    }

}
