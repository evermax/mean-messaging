import { Request, Response } from 'express';

export const sendJSONResponse = (res: Response, status: number, content: any) => {
    res.status(status).json(content);
    return;
};
