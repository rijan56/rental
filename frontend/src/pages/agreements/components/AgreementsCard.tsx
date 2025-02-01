import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComplaintsRepository } from "@/core/repositories/complaintsRepository";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AgreementsCard = ({
  data,
  userType,
}: {
  data: any[];
  userType: "tenant" | "landlord";
}) => {
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPLIED":
        return "bg-blue-100 text-blue-800";
      case "ACCEPTED":
        return "bg-green-300 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAgreementView = async (agreementId: number) => {
    navigate(`/agreements/${agreementId}`);
  };

  const handlePayment = async (agreementId: number) => {
    navigate(`/payment/${agreementId}`);
  };

  const onSubmit = async (data: any, agreementId: number | string) => {
    console.log("Form submitted for agreement:", agreementId, data);
    try {
      await ComplaintsRepository.postComplaint(data, Number(agreementId));
      toast("Successfully submitted the agreement");
    } catch (err) {
      toast("Error while submitting complaint");
    }
    reset();
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
      {data.map((agreement) => (
        <div
          key={agreement.start_date}
          className="border rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex flex-row justify-between">
              <div className="sm:text-ellipsis truncate">
                {agreement.property.title}
              </div>

              <span className="text-lg font-bold text-green-600">
                ${agreement.amount}
              </span>
            </div>

            <div className="space-y-2">
              <div>{}</div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-sm">
                  {formatDate(agreement.start_date)} -{" "}
                  {formatDate(agreement.end_date)}
                </span>
              </div>

              {agreement.message && (
                <div className="mt-3 text-sm text-gray-600 line-clamp-2 italic">
                  "{agreement.message}"
                </div>
              )}
            </div>
          </div>

          <div className="border-t px-4 py-3 bg-gray-50">
            {userType === "landlord" ? (
              <div className="flex w-full justify-between items-center">
                <button
                  onClick={() => handleAgreementView(agreement.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agreement.status === "APPLIED"
                      ? getStatusColor("PENDING")
                      : getStatusColor(agreement.status)
                  }
                `}
                >
                  {agreement.status === "APPLIED"
                    ? "PENDING"
                    : agreement.status}
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center ">
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      agreement.status
                    )}`}
                  >
                    {agreement.status}
                  </span>
                </div>

                {agreement.status === "ACCEPTED" && (
                  <div className="flex gap-2  justify-end items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="sm:text-ellipsis truncate bg-red-500 text-white hover:bg-red-700 hover:text-white "
                        >
                          File Complaint
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form
                          onSubmit={handleSubmit((formData) =>
                            onSubmit(formData, agreement.id)
                          )}
                        >
                          <DialogHeader>
                            <DialogTitle>File Complaint</DialogTitle>
                            <DialogDescription>
                              File complaint to the agreement.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="title" className="text-right">
                                Title
                              </Label>
                              <Input
                                id="title"
                                className="col-span-3"
                                {...register("title", { required: true })}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="description"
                                className="text-right"
                              >
                                Description
                              </Label>
                              <Input
                                id="description"
                                className="col-span-3"
                                {...register("description", { required: true })}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Submit</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      className="text-sm bg-blue-700 hover:bg-blue-900"
                      onClick={() => handlePayment(agreement.id)}
                    >
                      Pay Now
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgreementsCard;
