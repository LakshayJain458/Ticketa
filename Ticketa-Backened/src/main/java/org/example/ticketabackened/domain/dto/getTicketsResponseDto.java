package org.example.ticketabackened.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.ticketabackened.domain.enums.TicketStatus;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class getTicketsResponseDto {
    private UUID id;
    private TicketStatus status;
    private String eventName;
    private getTicketTypeResponseDto ticketType;
}
