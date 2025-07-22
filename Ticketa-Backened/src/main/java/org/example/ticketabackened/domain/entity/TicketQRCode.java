package org.example.ticketabackened.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.ticketabackened.domain.enums.QrCodeStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "ticket_qr_code")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketQRCode {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "code_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private QrCodeStatus codeStatus;

    @Column(name = "value", columnDefinition = "TEXT", nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @CreatedDate
    @Column(name = "created_At", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "modified_At", nullable = false)
    private LocalDateTime modifiedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TicketQRCode that = (TicketQRCode) o;
        return Objects.equals(id, that.id) && codeStatus == that.codeStatus && Objects.equals(value, that.value) && Objects.equals(createdAt, that.createdAt) && Objects.equals(modifiedAt, that.modifiedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, codeStatus, value, createdAt, modifiedAt);
    }
}
