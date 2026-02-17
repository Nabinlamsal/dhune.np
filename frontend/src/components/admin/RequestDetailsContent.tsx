import { useRequestDetail } from "@/src/hooks/orders/useRequest"
import { Detail } from "../common/DetailItem"


function RequestDetailsContent({ id }: { id: string }) {
  const { data, isLoading } = useRequestDetail(id)

  if (isLoading) {
    return <div>Loading...</div>
  }

  const request = data?.data
  if (!request) return null

  return (
    <div className="space-y-4 text-sm">
      <Detail label="Request ID" value={request.id} />
      <Detail label="Pickup Address" value={request.pickup_address} />
      <Detail
        label="Pickup From"
        value={new Date(request.pickup_time_from).toLocaleString()}
      />
      <Detail
        label="Pickup To"
        value={new Date(request.pickup_time_to).toLocaleString()}
      />
      <Detail label="Payment Method" value={request.payment_method} />
      <Detail label="Status" value={request.status} />

      <div>
        <p className="text-gray-500 mb-2">Services</p>
        <div className="space-y-2">
          {request.services.map((svc, index) => (
            <div
              key={index}
              className="border rounded p-3"
            >
              <Detail label="Category ID" value={svc.category_id} />
              <Detail label="Unit" value={svc.selected_unit} />
              <Detail
                label="Quantity"
                value={String(svc.quantity_value)}
              />
              {svc.description && (
                <Detail label="Description" value={svc.description} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
