"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/components/Button";
import Input from "@/components/Input";
import GoogleIcon from "@/components/icons/GoogleIcon";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const { status } = useSession();
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    // formState: { errors },
  } = useForm<LoginFormInputs>();

  if (status === "authenticated") {
    router.push("/");
  }

  const handleEmailLogin: SubmitHandler<LoginFormInputs> = async (values) => {
    await signIn("email", {
      email: values.email,
      password: values.password,
      redirect: true,
    });
    // router.push("/dashboard");
  };

  return (
    <div className="p-6 rounded-lg border flex-col border-slate-100 shadow-lg w-96 flex justify-center gap-y-3">
      Login with Email
      <form
        onSubmit={handleSubmitEmail(handleEmailLogin)}
        className="flex flex-col justify-center gap-y-3"
      >
        <Input
          required
          className="w-full"
          placeholder="Email"
          type="email"
          {...registerEmail("email")}
        />
        <Input
          required
          className="w-full"
          placeholder="Password"
          // autoComplete="off"
          type="password"
          {...registerEmail("password")}
        />
        <Button type="submit" className="w-full">
          Sign in with Email
        </Button>
      </form>
      <div className="h-[1px] bg-slate-200 my-4" />
      Login with OAuth
      <Button
        className="w-full shadow-sm text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 active:bg-zinc-200"
        onClick={() => signIn("google")}
      >
        Sign in with Google <GoogleIcon />
      </Button>
    </div>
  );
};

export default LoginForm;
