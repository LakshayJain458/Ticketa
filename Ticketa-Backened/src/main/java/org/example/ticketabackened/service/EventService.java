package org.example.ticketabackened.service;

import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.model.EventCreationRequest;

import java.util.UUID;

public interface EventService {
    Event createEvent(UUID organiserId, EventCreationRequest event);
}
