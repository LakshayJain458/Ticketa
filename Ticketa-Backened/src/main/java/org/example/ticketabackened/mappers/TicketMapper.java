package org.example.ticketabackened.mappers;

import org.example.ticketabackened.domain.dto.getTicketResponseDto;
import org.example.ticketabackened.domain.dto.getTicketsResponseDto;
import org.example.ticketabackened.domain.dto.getTicketTypeResponseDto;
import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.domain.entity.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {
    getTicketTypeResponseDto toDto(TicketType ticketType);

    @Mapping(target = "eventName", source = "ticket.ticketType.event.eventName")
    getTicketsResponseDto toDto(Ticket ticket);

    @Mapping(target = "ticketTypeName" , source = "ticket.ticketType.name")
    @Mapping(target = "price" , source = "ticket.ticketType.price")
    @Mapping(target = "description" , source = "ticket.ticketType.description")
    @Mapping(target = "eventName" , source = "ticket.ticketType.event.eventName")
    @Mapping(target = "eventVenue" , source = "ticket.ticketType.event.venue")
    @Mapping(target = "eventStartDateTime" , source = "ticket.ticketType.event.startDateTime")
    @Mapping(target = "eventEndDateTime" , source = "ticket.ticketType.event.endDateTime")
    getTicketResponseDto toGetTicketResponseDto(Ticket ticket);
}
