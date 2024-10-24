import * as React from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function otpForm() {
    const [value, setValue] = React.useState("");
    const onSubmit = () => {
        if (value.length < 6) {
            console.log("Enter a valid OTP");
            return;
        }
        console.log(value);
    }
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Enter OTP</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5 items-center ">

                            <InputOTP maxLength={6} value={value}
                                onChange={value => setValue(value)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>

                        </div>


                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Skip</Button>
                <Button onClick={onSubmit}>Submit</Button>
            </CardFooter>
        </Card>
    )
}
export default otpForm;