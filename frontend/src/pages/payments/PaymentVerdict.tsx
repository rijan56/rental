import { paymentRepository } from "@/core/repositories/paymentRepository";
import { useEffect } from "react";
import { useParams } from "react-router";

const PaymentVerdict = () => {
  const { uuid } = useParams();
  const setVerdict = async (uuid: string, status: string) => {
    const res = await paymentRepository.setVerdict(uuid, status);
    console.log(res);
  };
  const params = new URLSearchParams(`${window.location}`);
  let status = params.get("status");
  useEffect(() => {
    console.log(status);
    setVerdict(uuid!, status!);
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-row">
      <div className="flex-grow p-6">
        <div className="max-w-2xl mx-auto">
          {status === "User canceled" ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-red-700 mb-2">
                    Payment Failed
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your payment was canceled. This could be due to insufficient
                    funds, card declined, or you may have canceled the
                    transaction.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-green-700 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your payment has been processed successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerdict;
