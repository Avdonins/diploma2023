import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            const { authToken } = req.body
            await prisma.user.findFirst({
                where: {
                    authToken
                },
            }).then(async user => {
                const username= user.username
                await prisma.user.update({
                    where: {
                        username
                    },
                    data: {
                        authToken: ""
                    }
                })
                res.status(200).json({
                    message: "Вы успешно вышли из аккаунта"
                })
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            break
    }
}