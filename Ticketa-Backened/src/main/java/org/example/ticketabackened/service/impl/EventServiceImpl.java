package org.example.ticketabackened.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.entity.TicketType;
import org.example.ticketabackened.domain.entity.User;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.exceptionHandler.UserNotFoundException;
import org.example.ticketabackened.repositories.UserRepository;
import org.example.ticketabackened.repositories.EventRepository;
import org.example.ticketabackened.service.EventService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final UserRepository userRepo;
    private final EventRepository EventRepository;

    @Override
    public Event createEvent(UUID organiserId, EventCreationRequest event) {
        User organiser = userRepo.findById(organiserId).orElseThrow(
                () -> new UserNotFoundException("User with id " + organiserId + " not found")
        );


        List<TicketType> newTicketTypes = event.getTicketTypes().stream().map(
                ticketTypes -> {
                    TicketType newTicketType = new TicketType();
                    newTicketType.setName(ticketTypes.getName());
                    newTicketType.setPrice(ticketTypes.getPrice());
                    newTicketType.setAvailableTickets(ticketTypes.getAvailableTickets());
                    newTicketType.setDescription(ticketTypes.getDescription());
                    return newTicketType;
                }
        ).toList();

        Event newEvent = new Event();
        newEvent.setEventName(event.getEventName());
        newEvent.setStartDateTime(event.getStartDateTime());
        newEvent.setEndDateTime(event.getEndDateTime());
        newEvent.setVenue(event.getVenue());
        newEvent.setSalesStartDateTime(event.getSalesStartDateTime());
        newEvent.setSalesEndDateTime(event.getSalesEndDateTime());
        newEvent.setStatus(event.getStatus());
        newEvent.setOrganizer(organiser);
        newEvent.setTicketTypes(newTicketTypes);
        return EventRepository.save(newEvent);
    }
}
