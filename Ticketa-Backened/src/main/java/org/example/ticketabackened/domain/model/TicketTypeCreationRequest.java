package org.example.ticketabackened.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketTypeCreationRequest {
    private String name;
    private String description;
    private double price;
    private int availableTickets;
}
