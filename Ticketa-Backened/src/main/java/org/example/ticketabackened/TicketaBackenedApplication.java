package org.example.ticketabackened;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.example.ticketabackened.repositories")
public class TicketaBackenedApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketaBackenedApplication.class, args);
    }

}
