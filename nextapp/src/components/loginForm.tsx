"use client";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/actions/auth";
import { login } from "@/lib/storeActions/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from "@/lib/hooks";

type CardProps = React.ComponentProps<typeof Card>;
type Logininformation = {
  Email: string;
  Password: string;
};
const LoginFrom: React.FC<CardProps> = ({ className, ...props }: CardProps) => {
  const [loginInfo, setLoginInfo] = useState<Logininformation>({
    Email: "",
    Password: "",
  });



  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  console.log(user);
  const mutation = useMutation<
    { user: any; success: boolean } | undefined,
    Error,
    Logininformation
  >({
    mutationFn: (loginInfo: Logininformation) => loginUser(loginInfo),
    onSuccess: (data) => {
      console.log(data);
      if (data?.success) {
        dispatch(
          login({
            id: data.user.id,
            name: data.user.name,
            Email: data.user.Email,
            Username: data.user.Username,
          })
        );
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(loginInfo);
    console.log("Logging in");
    mutation.mutate({
      Email: loginInfo.Email,
      Password: loginInfo.Password,
    } as any);
  };

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="name"
                  name="Email"
                  onChange={onchange}
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Password</Label>
                <Input
                  id="name"
                  name="Password"
                  onChange={onchange}
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Login</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LoginFrom;
