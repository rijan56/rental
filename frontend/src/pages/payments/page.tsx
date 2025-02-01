import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/core/presentation/components/Sidebar";
import { paymentRepository } from "@/core/repositories/paymentRepository";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

const page = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    const res = await paymentRepository.initatePayment(Number(id), data.amount);
    window.open(res, "_blank");
  };

  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className=" p-4">
          <h1>Pay Now</h1>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label>Enter Amount</Label>
              <Input type="number" {...register("amount")} />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
