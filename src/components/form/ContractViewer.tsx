import React from "react";
import { useTranslation } from "react-i18next";
import Box from "../Box";
import { trpc } from "../../../utils/trpc";

function ContractViewer({ orderId }: { orderId: number }) {
  const { t } = useTranslation();
  const {
    data: contract,
    isLoading,
    error,
  } = trpc.main.getContractByOrderId.useQuery({ orderId });

  if (isLoading) return <div>Loading contract...</div>;
  if (error) return <div>Error loading contract</div>;
  if (!contract) return <div>No contract found</div>;

  return (
    <Box>
      <h2 className="font-PeydaBold text-center mb-4">متن قرارداد</h2>
      <div className="space-y-4">
        {contract.content
          ?.slice(0, contract.currentStep)
          .map((paragraph, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-PeydaBold text-lg mb-2">{paragraph.title}</h3>
              <p className="font-PeydaRegular text-justify">
                {paragraph.content}
              </p>
              {index < contract.currentStep - 1 && (
                <div className="text-center my-2">
                  <div className="inline-block border-t border-gray-300 w-16"></div>
                </div>
              )}
            </div>
          ))}
      </div>
    </Box>
  );
}

export default ContractViewer;
