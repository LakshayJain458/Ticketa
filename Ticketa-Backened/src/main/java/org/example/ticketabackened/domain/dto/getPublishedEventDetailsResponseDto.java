package org.example.ticketabackened.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.ticketabackened.domain.enums.EventStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class getPublishedEventDetailsResponseDto {
    private UUID id;
    private String eventName;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String venue;
    private List<getPublishedEventTicketTypeResponseDto> ticketTypes = new ArrayList<>();
}
