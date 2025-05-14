import { Event } from 'src/events/entities/event.entity';
import { OrganizationDetail } from 'src/organization-details/entities/organization-detail.entity';
import { PartnerDetail } from 'src/partner-details/entities/partner-detail.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventOrganization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  organizationDetailId: string;

  @Column({ type: 'uuid', nullable: true })
  partnerDetailId: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @ManyToOne(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.eventOrganization,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  organizationDetail: OrganizationDetail[];

  @ManyToOne(
    () => PartnerDetail,
    (partnerDetail) => partnerDetail.eventOrganization,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  partnerDetail: PartnerDetail[];

  @ManyToOne(() => Event, (event) => event.eventOrganization, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  event: Event[];
}
