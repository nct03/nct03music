import { BasicIP } from "../constant/Constants";

export const signup = async (name, email, password) => {
    try {
        const formData = {
            name: name,
            email: email,
            password: password,
        };
        const response = await fetch(`${BasicIP}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        if(!response.ok) {
            throw new Error("Đăng kí thất bại")
        }

        return response.json
    }  catch (err) {
        throw new Error(err.message)
    }
};   

export const login = async (email, password) => {
    try {
        const response = await fetch(`${BasicIP}/auth/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors[0]);
        }

        return data.token;
    } catch (error) {
        throw new Error(error.message);
    }
};