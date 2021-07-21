package me.shamanov.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Value("${spring.data.rest.base-path}")
    private String baseRestApiUrl;

    @Value("${rest.allowed-origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry cors) {
        cors.addMapping(this.baseRestApiUrl + "/**").allowedOrigins(this.allowedOrigins);
    }
}
