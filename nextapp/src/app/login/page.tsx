import * as React from "react"
import {
    Card,

} from "@/components/ui/card"

import LoginFrom from "@/components/loginForm"

type CardProps = React.ComponentProps<typeof Card>

const LoginPage: React.FC<CardProps> = ({ className, ...props }: CardProps) => {

    return (<> <div className="flex items-center justify-center min-h-screen">
        <LoginFrom />
    </div>
    </>)
}

export default LoginPage;