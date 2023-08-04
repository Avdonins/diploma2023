import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            const { authToken } = req.body
            const user = await prisma.user.findFirst({
                where: {
                    authToken
                }
            }).then(async (user) => {
                const basket = await prisma.basket.findFirst({
                    where: {
                        userId: user.id
                    },
                    include: {
                        devices: {
                            select: {
                                goodId: true,
                                good: true,
                                count: true
                            }
                        }
                    }
                }).then((basket) => {
                    res.status(200).json(basket)
                }).catch(err => {
                    res.status(400).json({ message: "Список пуст" })
                })
            }).catch(err => {
                res.status(400).json({ message: err.message })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}