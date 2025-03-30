import React from "react";
import { useTranslation } from "react-i18next";
import Box from "../Box";
import { trpc } from "../../../utils/trpc";

function ContractViewer({ orderId }) {
  const { t } = useTranslation();
  console.log("orderId", orderId);
  const { data: order, isLoading: isOrderLoading } =
    trpc.main.getOrderById.useQuery(
      { id: Number(orderId) },
      { enabled: !!orderId }
    );
  console.log("order", order);
  if (isOrderLoading) return <div>Loading contract...</div>;

  return (
    <Box>
      <h2 className="font-PeydaBold text-center mb-4">متن قرارداد</h2>
      <div className="space-y-4">{order && order.id}</div>
    </Box>
  );
}

export default ContractViewer;
