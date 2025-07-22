package org.example.ticketabackened.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.entity.TicketType;
import org.example.ticketabackened.domain.entity.User;
import org.example.ticketabackened.domain.enums.EventStatus;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.domain.model.EventUpdationRequest;
import org.example.ticketabackened.domain.model.TicketTypeUpdationRequest;
import org.example.ticketabackened.exceptionHandler.EventNotFoundException;
import org.example.ticketabackened.exceptionHandler.EventUpdateException;
import org.example.ticketabackened.exceptionHandler.TicketTypeNotFoundException;
import org.example.ticketabackened.exceptionHandler.UserNotFoundException;
import org.example.ticketabackened.repositories.UserRepository;
import org.example.ticketabackened.repositories.EventRepository;
import org.example.ticketabackened.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final UserRepository userRepo;
    private final EventRepository eventRepo;

    @Override
    @Transactional
    public Event createEvent(UUID organiserId, EventCreationRequest event) {
        User organiser = userRepo.findById(organiserId).orElseThrow(
                () -> new UserNotFoundException("User with id " + organiserId + " not found")
        );

        Event newEvent = new Event();

        List<TicketType> newTicketTypes = event.getTicketTypes().stream().map(
                ticketTypes -> {
                    TicketType newTicketType = new TicketType();
                    newTicketType.setName(ticketTypes.getName());
                    newTicketType.setPrice(ticketTypes.getPrice());
                    newTicketType.setAvailableTickets(ticketTypes.getAvailableTickets());
                    newTicketType.setDescription(ticketTypes.getDescription());
                    newTicketType.setEvent(newEvent);
                    return newTicketType;
                }
        ).toList();

        newEvent.setEventName(event.getEventName());
        newEvent.setStartDateTime(event.getStartDateTime());
        newEvent.setEndDateTime(event.getEndDateTime());
        newEvent.setVenue(event.getVenue());
        newEvent.setSalesStartDateTime(event.getSalesStartDateTime());
        newEvent.setSalesEndDateTime(event.getSalesEndDateTime());
        newEvent.setStatus(event.getStatus());
        newEvent.setOrganizer(organiser);
        newEvent.setTicketTypes(newTicketTypes);
        return eventRepo.save(newEvent);
    }

    @Override
    public Page<Event> getEventsForOrganiser(UUID organiserId, Pageable pageable) {
        return eventRepo.findByOrganizerId(organiserId, pageable);
    }

    @Override
    public Optional<Event> getEventForOrganiser(UUID eventId, UUID organiserId) {
        return eventRepo.findEventByIdAndOrganizerId(eventId, organiserId);
    }

    @Override
    @Transactional
    public Event updateEventForOrganiser(UUID eventId, UUID organiserId, EventUpdationRequest event) {

        if (event.getId() == null) {
            throw new EventNotFoundException("Event Id cannot be null");
        }
        if (!event.getId().equals(eventId)) {
            throw new EventUpdateException("Event Id cannot be updated");
        }

        Event oldEvent = eventRepo.findEventByIdAndOrganizerId(eventId, organiserId)
                .orElseThrow(() -> new EventNotFoundException("Event with id " + eventId + " not found"));

        oldEvent.setEventName(event.getEventName());
        oldEvent.setStartDateTime(event.getStartDateTime());
        oldEvent.setEndDateTime(event.getEndDateTime());
        oldEvent.setVenue(event.getVenue());
        oldEvent.setSalesStartDateTime(event.getSalesStartDateTime());
        oldEvent.setSalesEndDateTime(event.getSalesEndDateTime());
        oldEvent.setStatus(event.getStatus());

        // Map of existing ticket types (by ID)
        Map<UUID, TicketType> existingTicketMap = oldEvent.getTicketTypes().stream()
                .filter(t -> t.getId() != null)
                .collect(Collectors.toMap(TicketType::getId, Function.identity()));

        // Created a set of updated ticket IDs for tracking
        Set<UUID> incomingTicketIds = event.getTicketTypes().stream()
                .map(TicketTypeUpdationRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Removed orphaned ticket types
        oldEvent.getTicketTypes().removeIf(existing -> {
            UUID existingId = existing.getId();
            return existingId != null && !incomingTicketIds.contains(existingId);
        });

        // update or add incoming ticket types
        for (TicketTypeUpdationRequest ticketDto : event.getTicketTypes()) {
            if (ticketDto.getId() == null) {
                TicketType newTicket = new TicketType();
                newTicket.setName(ticketDto.getName());
                newTicket.setPrice(ticketDto.getPrice());
                newTicket.setAvailableTickets(ticketDto.getAvailableTickets());
                newTicket.setDescription(ticketDto.getDescription());
                newTicket.setEvent(oldEvent);
                oldEvent.getTicketTypes().add(newTicket);
            } else {
                TicketType existing = existingTicketMap.get(ticketDto.getId());
                if (existing == null) {
                    throw new TicketTypeNotFoundException("Ticket Type with ID " + ticketDto.getId() + " not found.");
                }
                existing.setName(ticketDto.getName());
                existing.setPrice(ticketDto.getPrice());
                existing.setAvailableTickets(ticketDto.getAvailableTickets());
                existing.setDescription(ticketDto.getDescription());
            }
        }

        return eventRepo.save(oldEvent);
    }

    @Override
    @Transactional
    public void deleteEventForOrganiser(UUID eventId, UUID organiserId) {
        getEventForOrganiser(eventId, organiserId).ifPresent(eventRepo::delete);
    }

    @Override
    public Page<Event> getPublishedEvents(Pageable pageable) {
        return eventRepo.findEventByStatus(EventStatus.PUBLISHED, pageable);
    }

    @Override
    public Page<Event> searchPublishedEvents(String query, Pageable pageable) {
        return eventRepo.searchEvents(query, pageable);
    }

    @Override
    public Optional<Event> getPublishedEvent(UUID eventId) {
        return eventRepo.findEventByIdAndStatus(eventId, EventStatus.PUBLISHED);
    }
}
