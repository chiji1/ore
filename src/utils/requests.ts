import {IUser} from "../apis/v1/users/user.model";
import {Request} from "express";

interface RequestParams {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: {};
    options?: RequestInit;
}
export const fetchRequest = async (data: RequestParams) => {
    const { url, method, headers, options } = data;
    const result = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...options,
    });
    return result.json();
}

export interface AuthenticatedRequest extends Request {
    user?: Partial<IUser>;
}
