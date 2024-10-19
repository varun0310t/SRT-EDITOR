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


    return (<> <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">

            <CardHeader>
                <CardTitle>Login</CardTitle>

            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Email</Label>
                            <Input id="name" placeholder="example@gmail.com" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Password</Label>
                            <Input id="name" placeholder="example@gmail.com" />
                        </div>
                    </div>
                </form>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>Login</Button>
            </CardFooter>
        </Card >
    </div>
    </>)
}

export default RegisterPage;