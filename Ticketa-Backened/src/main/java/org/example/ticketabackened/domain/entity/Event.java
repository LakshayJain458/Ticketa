package org.example.ticketabackened.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.ticketabackened.domain.enums.EventStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_Name", nullable = false)
    private String eventName;

    @Column(name = "start_Date_Time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_Date_Time", nullable = false)
    private LocalDateTime endDateTime;

    @Column(name = "venue", nullable = false)
    private String venue;

    @Column(name = "sales_Start_Date_Time")
    private LocalDateTime salesStartDateTime;

    @Column(name = "sales_End_Date_Time")
    private LocalDateTime salesEndDateTime;

    @Column(name = "event_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @ManyToMany(mappedBy = "attendingEvents")
    private List<User> attendeeUsers = new ArrayList<>();

    @ManyToMany(mappedBy = "staffingEvents")
    private List<User> staffMembers = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_At", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "modified_At", nullable = false)
    private LocalDateTime modifiedAt;
}
