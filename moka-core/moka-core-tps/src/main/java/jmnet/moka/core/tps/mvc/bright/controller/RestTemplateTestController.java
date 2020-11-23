package jmnet.moka.core.tps.mvc.bright.controller;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/resttemplatetest")
public class RestTemplateTestController {

    private final HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();

    @ApiOperation(value = "HttpRequest")
    @GetMapping("/getData2")
    public ResponseEntity<?> sendPost() throws Exception {
        String url = "https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials";
        // form parameters
        String params = "client_id=03cf20ff-f4c6-4668-87c8-ccaadb3680b4&client_secret=J7VeL4iUGc4xkVTLi7LZXj0fX0eX4CBvuYyPa3fHsIukwDIOG5kOHB0nYsVeHl0kD8_2n7UQK4dYihv_y-DJdw";

        HttpRequest request = HttpRequest.newBuilder()
                //.POST(buildFormDataFromMap(data))
                .POST(HttpRequest.BodyPublishers.ofString(params))
                .uri(URI.create(url))
                .setHeader("Content-Type", "application/x-www-form-urlencoded")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        // print status code
        System.out.println(response.statusCode());
        // print response body
        System.out.println(response.body());
        return new ResponseEntity<>(response.body(), HttpStatus.OK);
    }

    // map => ofString
    private static HttpRequest.BodyPublisher buildFormDataFromMap(Map<Object, Object> data) {
        var builder = new StringBuilder();
        for (Map.Entry<Object, Object> entry : data.entrySet()) {
            if (builder.length() > 0) {
                builder.append("&");
            }
            builder.append(URLEncoder.encode(entry.getKey().toString(), StandardCharsets.UTF_8));
            builder.append("=");
            builder.append(URLEncoder.encode(entry.getValue().toString(), StandardCharsets.UTF_8));
        }
        System.out.println(builder.toString());
        return HttpRequest.BodyPublishers.ofString(builder.toString());
    }
}

