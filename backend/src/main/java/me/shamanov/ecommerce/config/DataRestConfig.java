package me.shamanov.ecommerce.config;

import me.shamanov.ecommerce.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Type;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Value("${spring.data.rest.base-path}")
    private String baseRestApiUrl;

    @Value("${rest.allowed-origins}")
    private String[] allowedOrigins;

    @Autowired
    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // disable HTTP methods for Product: PUT, POST, DELETE AND PATCH
        this.disableHttpMethods(Product.class, config, unsupportedActions);

        // disable HTTP methods for ProductCategory: PUT, POST, DELETE AND PATCH
        this.disableHttpMethods(ProductCategory.class, config, unsupportedActions);

        // disable HTTP methods for State: PUT, POST, DELETE AND PATCH
        this.disableHttpMethods(State.class, config, unsupportedActions);

        // disable HTTP methods for Country: PUT, POST, DELETE AND PATCH
        this.disableHttpMethods(Country.class, config, unsupportedActions);

        // disable HTTP methods for Order: PUT, POST, DELETE AND PATCH
        this.disableHttpMethods(Order.class, config, unsupportedActions);

        // expose ids
        this.exposeIds(config);

        // configure cors mapping
        cors.addMapping(this.baseRestApiUrl + "/**").allowedOrigins(this.allowedOrigins);
    }

    private void disableHttpMethods(Class<?> clazz, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(clazz)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = this.entityManager.getMetamodel().getEntities();
        Class<?>[] domainTypes = entities.stream().map(Type::getJavaType).toArray(Class[]::new);
        config.exposeIdsFor(domainTypes);
    }
}
