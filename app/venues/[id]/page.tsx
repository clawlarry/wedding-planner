export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

import VenueDetailClient from "./client";

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  return <VenueDetailClient id={params.id} />;
}
