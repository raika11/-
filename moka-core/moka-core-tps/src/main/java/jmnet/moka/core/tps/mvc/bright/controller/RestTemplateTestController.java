package jmnet.moka.core.tps.mvc.bright.controller;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.core.tps.mvc.bright.service.RestTemplateTestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/resttemplatetest")
public class RestTemplateTestController {

    private RestTemplateTestService restTemplateTestService;

    @Autowired
    public RestTemplateTestController(RestTemplateTestService restTemplateTestService) {
        this.restTemplateTestService = restTemplateTestService;
    }

    @ApiOperation(value = "레스트템플릿")
    @GetMapping
    public ResponseEntity<?> restTemplateTest1() {

        return new ResponseEntity<>(restTemplateTestService.callPostExternalServer(), HttpStatus.OK);
    }
}
