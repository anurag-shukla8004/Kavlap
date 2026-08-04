import BookingDetailClient from '../BookingDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params;
  return <BookingDetailClient bookingId={id} />;
}
