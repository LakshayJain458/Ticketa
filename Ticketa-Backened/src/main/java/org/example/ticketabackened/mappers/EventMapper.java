package org.example.ticketabackened.mappers;

import org.example.ticketabackened.domain.dto.*;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.entity.TicketType;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.domain.model.EventUpdationRequest;
import org.example.ticketabackened.domain.model.TicketTypeCreationRequest;
import org.example.ticketabackened.domain.model.TicketTypeUpdationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    TicketTypeCreationRequest fromDto(TicketTypeCreationRequestDto dto);

    EventCreationRequest fromDto(EventCreationRequestDto dto);

    EventCreationResponseDto toDto(Event event);

    getEventsTicketTypeResponseDto toDto(TicketType ticketType);

    getEventsResponseDto togetEventsResponseDto(Event event);

    getEventDetailsResponseDto toEventDetailsResponseDto(Event event);

    TicketTypeUpdationRequest fromDto(TicketTypeUpdationRequestDto dto);

    EventUpdationRequest fromDto(EventUpdationRequestDto dto);

    TicketTypeUpdationResponseDto toTicketTypeUpdationResponseDto(TicketType ticketType);

    EventUpdationResponseDto toEventUpdationResponseDto(Event event);

    getPublishedEventsResponseDto toPublishedEventsResponseDto(Event event);

    getPublishedEventTicketTypeResponseDto toPublishedEventTicketTypeResponseDto(TicketType ticketType);

    getPublishedEventDetailsResponseDto toPublishedEventDetailsResponseDto(Event event);

}
