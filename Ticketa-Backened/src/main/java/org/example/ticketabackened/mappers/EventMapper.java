package org.example.ticketabackened.mappers;

import org.example.ticketabackened.domain.dto.EventCreationRequestDto;
import org.example.ticketabackened.domain.dto.EventCreationResponseDto;
import org.example.ticketabackened.domain.dto.TicketTypeCreationRequestDto;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.domain.model.TicketTypeCreationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    TicketTypeCreationRequest fromDto(TicketTypeCreationRequestDto dto);

    EventCreationRequest fromDto(EventCreationRequestDto dto);

    EventCreationResponseDto toDto(Event event);

}
