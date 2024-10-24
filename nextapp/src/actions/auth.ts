"use server"

import { auth } from '@/lib/DB/connectDB';
import { cookies } from 'next/headers';
import connectDB from '@/lib/DB/connectDB';
import { UserDoc, SessionDoc,KeyDoc } from '@/types/ModelTypes';


interface RegisterUserParams {
    Name: string;
    Username: string;
    Email: string;
    Password: string;
}
export const registerUser = async ({ Name, Username, Email, Password }: RegisterUserParams) => {
    await connectDB();
    try {
        const user: UserDoc = await auth.createUser({
            key: {
                providerId: 'email',
                providerUserId: Email,
                password: Password
            },
            attributes: {
                Name: Name,
                Username: Username,
                Email: Email,
            }
        }

        );
        const currentUser = await auth.getUser(user.userId);
        console.log(currentUser);
        const session: SessionDoc = await auth.createSession({
            userId: user.userId,
            attributes: {},
        });

        const sessionCookie = auth.createSessionCookie(session);

        cookies().set({
            name: sessionCookie.name,
            value: sessionCookie.value,
            httpOnly: sessionCookie.attributes.httpOnly,
            maxAge: sessionCookie.attributes.maxAge,
            path: sessionCookie.attributes.path,
            secure: sessionCookie.attributes.secure,
            sameSite: sessionCookie.attributes.sameSite,
        });

        console.log('User registered successfully' + user);
        return { user, success: true };
    } catch (err) {
        console.error(err);
    }
}

export const loginUser = async ({ Email, Password }: { Email: string; Password: string }) => {
    await connectDB();
    try {
        const key = await auth.useKey("email", Email, Password);
        const user = await auth.getUser(key.userId);
        const session: SessionDoc = await auth.createSession({
            userId: user.userId,
            attributes: {},
        });

        const sessionCookie = auth.createSessionCookie(session);

        cookies().set({
            name: sessionCookie.name,
            value: sessionCookie.value,
            httpOnly: sessionCookie.attributes.httpOnly,
            maxAge: sessionCookie.attributes.maxAge,
        });


        console.log('User logged in successfully' + user);
        return { user, success: true };
    } catch (err) {
        console.error(err);

    }
}

