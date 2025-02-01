import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VisibilityOffIcon from "@/core/assets/icons/VisibilityOffIcon";
import VisibilityOnIcon from "@/core/assets/icons/VisibilityOnIcon";
import { useAuth } from "@/core/context/authContext";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ILoginForm {
  username: string;
  password: string;
  type: "tenant" | "landlord";
}

const LoginForm = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>();

  const onSubmit = async (data: ILoginForm) => {
    try {
      await login(data);
      toast.success("Logged in successfully");
      console.log("logged in w/ user , ", user);

      navigate("/");
    } catch (err: any) {
      toast("Login failed, check credentials ");
      console.log(err);
    }
  };
  return (
    <Card className="min-w-lg p-10">
      <form
        className="w-full flex flex-col gap-3 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <Label>Type</Label>
        <Controller
          name="type"
          control={control}
          rules={{ required: "Type is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Tenant/Landlord" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="landlord">LandLord</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Label>Username</Label>
        <Input
          type="text"
          {...register("username", {
            required: "username is requried",
          })}
        />
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
          </button>
        </div>
        {Object.values(errors).length > 0 && (
          <div>
            {Object.values(errors).map((error) => (
              <p className="p-2 bg-red-100 text-red-600 rounded-md my-1">
                {error?.message}
              </p>
            ))}
          </div>
        )}
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={isSubmitting}
        >
          Log In
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
