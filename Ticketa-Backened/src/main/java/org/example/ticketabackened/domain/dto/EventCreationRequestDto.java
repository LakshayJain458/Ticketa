package org.example.ticketabackened.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.ticketabackened.domain.enums.EventStatus;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCreationRequestDto {

    @NotBlank(message = "Event name is required")
    @Size(max = 100, message = "Event name must not exceed 100 characters")
    private String eventName;

    @NotNull(message = "Start date and time is required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date and time is required")
    private LocalDateTime endDateTime;

    @NotBlank(message = "Venue is required")
    @Size(max = 200, message = "Venue must not exceed 200 characters")
    private String venue;

    @NotNull(message = "Sales start date and time is required")
    private LocalDateTime salesStartDateTime;

    @NotNull(message = "Sales end date and time is required")
    private LocalDateTime salesEndDateTime;

    @NotNull(message = "Event status is required")
    private EventStatus status;

    @NotEmpty(message = "At least one ticket type must be provided")
    @Valid
    private List<@Valid TicketTypeCreationRequestDto> ticketTypes;
}
