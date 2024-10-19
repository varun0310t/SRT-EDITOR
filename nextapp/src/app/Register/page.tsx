"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LabelCheckBox } from "@/components/CustomCheckbox"

import { ThemeModeToggle } from "@/components/ThemeModeToggle";
type CardProps = React.ComponentProps<typeof Card>

const RegisterPage: React.FC<CardProps> = ({ className, ...props }: CardProps) => {

    type Registerinformation = {
        Name: String,
        Email: String,
        Password: String,
        Username: String
    }

    const [RegisterInfo, setRegisterInfo] = React.useState<Registerinformation>({ Name: "", Email: "", Password: "", Username: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(RegisterInfo)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterInfo({
            ...RegisterInfo,
            [e.target.id]: e.target.value
        })


    }

    return (<> <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">

            <CardHeader>
                <CardTitle>Register</CardTitle>

            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="Name" onChange={handleChange} placeholder="Name" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">username</Label>
                            <Input id="Username" onChange={handleChange} placeholder="username123" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Email</Label>
                            <Input id="Email" onChange={handleChange} placeholder="example@gmail.com" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Password</Label>
                            <Input id="Password" onChange={handleChange} placeholder="example@gmail.com" />
                        </div>

                    </div>
                </form>

            </CardContent>

            <CardFooter className="flex justify-between">
                <LabelCheckBox LabelContent={"Accept terms and conditions"}></LabelCheckBox> <Button>Register</Button>
            </CardFooter>
        </Card >
    </div>
    </>)
}

export default RegisterPage;