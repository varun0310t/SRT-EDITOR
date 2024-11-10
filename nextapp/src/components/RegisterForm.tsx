"use client";

import * as React from "react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { LabelCheckBox } from "@/components/CustomCheckbox";
import { UserDoc } from "@/types/ModelTypes";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { on } from "events";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from "@/lib/hooks";
import { login } from "@/lib/storeActions/userSlice";
import { log } from "console";
type CardProps = React.ComponentProps<typeof Card>;

type RegisterPageProps = CardProps & {
  SetRegister?: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterForm: React.FC<RegisterPageProps> = ({
  className,
  SetRegister,
  ...props
}: RegisterPageProps) => {
  const mutation = useMutation<
    { user: UserDoc; success: boolean } | undefined,
    Error,
    Registerinformation
  >({
    mutationFn: (registerInfo: Registerinformation) =>
      registerUser(registerInfo),
    onSuccess: (data) => {
      if (SetRegister) {
        if (data?.success) {
          if (SetRegister) {
            SetRegister(true);
          }
          dispatch(
            login({
              id: data.user.id,
              name: data.user.Name,
              Email: data.user.Email,
              Username: data.user.Username,
            })
          );
        }
      }
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const dispatch = useAppDispatch();

  type Registerinformation = {
    Name: string;
    Email: string;
    Password: string;
    Username: string;
  };

  const [RegisterInfo, setRegisterInfo] = React.useState<Registerinformation>({
    Name: "",
    Email: "",
    Password: "",
    Username: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(RegisterInfo);
    console.log("Registering");
    mutation.mutate({
      Name: RegisterInfo.Name,
      Username: RegisterInfo.Username,
      Email: RegisterInfo.Email,
      Password: RegisterInfo.Password,
    } as any);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id);
    setRegisterInfo({
      ...RegisterInfo,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="Name" onChange={handleChange} placeholder="Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">username</Label>
                <Input
                  id="Username"
                  onChange={handleChange}
                  placeholder="username123"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="Email"
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Password</Label>
                <Input
                  id="Password"
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <LabelCheckBox
            LabelContent={"Accept terms and conditions"}
          ></LabelCheckBox>{" "}
          <Button onClick={handleSubmit}>Register</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default RegisterForm;
