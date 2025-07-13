package org.example.ticketabackened.domain.dto;

import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketTypeCreationRequestDto {

    @NotBlank(message = "Ticket type name is required")
    @Size(max = 50, message = "Ticket type name must not exceed 50 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price cannot be negative")
    private double price;

    @Min(value = 1, message = "There must be at least 1 ticket available")
    private int availableTickets;
}
