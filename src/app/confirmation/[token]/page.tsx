import ConfirmationPage from '@/components/pages/confirmation/ConfirmationPage';

export default async function OrderConfirmation({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ConfirmationPage token={token} />;
}
