package jmnet.moka.core.tps.mvc.bright.service;

import jmnet.moka.core.tps.mvc.bright.dto.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
public class RestTemplateTestService {

    private ApiService<Response> apiService;

    @Autowired
    public RestTemplateTestService(ApiService<Response> apiService) {
        this.apiService = apiService;
    }


    public Response callPostExternalServer() {
        String param = "03cf20ff-f4c6-4668-87c8-ccaadb3680b4:J7VeL4iUGc4xkVTLi7LZXj0fX0eX4CBvuYyPa3fHsIukwDIOG5kOHB0nYsVeHl0kD8_2n7UQK4dYihv_y-DJdw";
        String path = "https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials";
        // CORS enablement and other headers
//        header("Access-Control-Allow-Origin: *");
//        header("Content-type: application/json");
//        header("X-Content-Type-Options: nosniff");
//        header("X-XSS-Protection");

//        Map<String, String> header = new HashMap<String, String>();
//        header.put("Content-type", MediaType.APPLICATION_FORM_URLENCODED.toString());
//        header.put("Accept", MediaType.APPLICATION_JSON_VALUE);
//        header.put("Authorization", "Basic " + encodedCredentials);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(new MediaType("application","json"));    //Response Header to UTF-8
        httpHeaders.setAccessControlAllowOrigin("*");

        return apiService.post(path, httpHeaders, param, Response.class).getBody();
    }
}
