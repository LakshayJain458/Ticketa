package org.example.ticketabackened.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.ticketabackened.domain.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class getTicketResponseDto {
    private UUID id;
    private TicketStatus status;
    private String ticketTypeName;
    private double price;
    private String description;
    private String eventName;
    private String eventVenue;
    private LocalDateTime eventStartDateTime;
    private LocalDateTime eventEndDateTime;
}
