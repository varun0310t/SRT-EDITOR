"use client"

import * as React from "react"
import { registerUser } from "@/actions/auth"
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
import { useMutation } from "@tanstack/react-query"
import { LabelCheckBox } from "@/components/CustomCheckbox"
import { UserDoc } from "@/types/ModelTypes"
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { on } from "events"
import RegisterForm from "@/components/RegisterForm"
import OTPForm from "@/components/otpForm"


const RegisterPage: React.FC<any> = ({ className, ...props }) => {

    const [register, SetRegister] = React.useState<boolean>(false);



    return (<> <div className="flex items-center justify-center min-h-screen">
        {!register && <RegisterForm SetRegister={SetRegister} />}
        {register && <OTPForm />}
    </div>
    </>)
}

export default RegisterPage;