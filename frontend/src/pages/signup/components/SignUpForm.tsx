import { Button } from "@/components/ui/button";
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
import { SignUp } from "@/core/services/authService";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface IRegisterForm {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  password: string;
  confirmPassword: string;
  thumbnail: ImageData;
  type: "tenant" | "landlord";
}

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: IRegisterForm) => {
    try {
      const result = await SignUp(data);
      toast.success("Registration successful! Redirecting to login....");
      navigate("/login");
      console.log(result);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-row w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-3"
      >
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
          {...register("username", { required: "Username is required" })}
        />

        <Label>First Name</Label>
        <Input
          {...register("first_name", { required: "First name is required" })}
        />

        <Label>Last Name</Label>
        <Input
          {...register("last_name", { required: "Last name is required" })}
        />

        <Label>Email</Label>
        <Input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />

        <Label>Contact</Label>
        <Input
          type="number"
          {...register("phone", {
            required: "Phone number is required",
            minLength: {
              value: 10,
              message: "Phone number must be at least 10 digits",
            },
            maxLength: { value: 15, message: "Cannot exceed 15 digits" },
          })}
        />

        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
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

        <Label>Confirm Password</Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) => value === password || "Passwords must match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showConfirmPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
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
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
