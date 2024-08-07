"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  if (status === "authenticated") {
    router.push("/");
  }

  const handleRegister: SubmitHandler<RegisterFormInputs> = async (values) => {
    try {
      const { status, data } = await axios.post("/api/register", values);
      if (status === 200 || status === 201) {
        console.log({ data });
        toast.success("Successfully registered!");
        router.push("/");
      } else {
        toast.error(data.message ?? "An error occurred.");
      }
    } catch (error: any) {
      toast.error(error?.response.data.message ?? "An error occurred.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="p-6 rounded-lg border flex-col border-slate-100 shadow-lg w-96 flex justify-center gap-y-3"
    >
      Register with Email
      <Input
        required
        className="w-full"
        placeholder="First Name"
        type="text"
        {...register("firstName", { required: "First name is required" })}
      />
      {errors.firstName && (
        <span className="text-red-500">{errors.firstName.message}</span>
      )}
      <Input
        required
        className="w-full"
        placeholder="Last Name"
        type="text"
        {...register("lastName", { required: "Last name is required" })}
      />
      {errors.lastName && (
        <span className="text-red-500">{errors.lastName.message}</span>
      )}
      <Input
        required
        className="w-full"
        placeholder="Email"
        type="email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && (
        <span className="text-red-500">{errors.email.message}</span>
      )}
      <Input
        required
        className="w-full"
        placeholder="Phone"
        type="text"
        {...register("phone", { required: "Phone number is required" })}
      />
      {errors.phone && (
        <span className="text-red-500">{errors.phone.message}</span>
      )}
      <Input
        required
        className="w-full"
        placeholder="Password"
        autoComplete="off"
        type="password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && (
        <span className="text-red-500">{errors.password.message}</span>
      )}
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
