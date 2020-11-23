package jmnet.moka.core.tps.mvc.bright.controller;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.core.tps.mvc.bright.dto.DataDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/resttemplatetest")
public class BrightController {

    private final HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();

    @ApiOperation(value = "HttpRequest")
    @GetMapping("/brightCov")
    public ResponseEntity<?> sendPost(@Valid DataDto data) throws Exception {
//        clientId : 03cf20ff-f4c6-4668-87c8-ccaadb3680b4
//        clientSecret : J7VeL4iUGc4xkVTLi7LZXj0fX0eX4CBvuYyPa3fHsIukwDIOG5kOHB0nYsVeHl0kD8_2n7UQK4dYihv_y-DJdw
        // 프로퍼티에서 가져오는것으로 저장[tps-auto]
//        String url = "https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials";
//        String params = "client_id=" + data.getClientId() + "&client_secret=" + data.getClientSecret();
//
//        HttpRequest request = HttpRequest.newBuilder()
//                .POST(HttpRequest.BodyPublishers.ofString(params))
//                .uri(URI.create(url))
//                .setHeader("Content-Type", "application/x-www-form-urlencoded")
//                .build();
//
//        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
//        // print status code
//        System.out.println(response.statusCode());
//        // print response body
//        System.out.println(response.body());
        return new ResponseEntity<>("", HttpStatus.OK);
    }
}

