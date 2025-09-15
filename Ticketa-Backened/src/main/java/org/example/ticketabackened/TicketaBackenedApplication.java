package org.example.ticketabackened;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.example.ticketabackened.repositories")
@EntityScan("org.example.ticketabackened.domain.entity")
@EnableJpaAuditing
public class TicketaBackenedApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketaBackenedApplication.class, args);
    }

}
