package org.example.ticketabackened.service;

import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.domain.model.EventUpdationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface EventService {
    Event createEvent(UUID organiserId, EventCreationRequest event);

    Page<Event> getEventsForOrganiser(UUID organiserId, Pageable pageable);

    Optional<Event> getEventForOrganiser(UUID eventId, UUID organiserId);

    Event updateEventForOrganiser(UUID eventId, UUID organiserId, EventUpdationRequest event);

    void deleteEventForOrganiser(UUID eventId, UUID organiserId);

    Page<Event> getPublishedEvents(Pageable pageable);

    Page<Event> searchPublishedEvents(String query, Pageable pageable);

    Optional<Event> getPublishedEvent(UUID eventId);

}
