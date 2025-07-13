package org.example.ticketabackened.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketTypeCreationResponseDto {
    private UUID id;
    private String name;
    private String description;
    private double price;
    private int availableTickets;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

}
