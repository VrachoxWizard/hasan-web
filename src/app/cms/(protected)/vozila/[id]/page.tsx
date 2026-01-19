import VehicleFormClient from "@/app/cms/(protected)/ui/VehicleFormClient";

export default async function CmsEditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VehicleFormClient mode="edit" vehicleId={id} />;
}
