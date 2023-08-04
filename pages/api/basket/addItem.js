import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            const { authToken, goodId } = req.body
            const user = await prisma.user.findFirst({
                where: {
                    authToken
                }
            }).then(async (user) => {
                const basket = await prisma.basket.update({
                    where: {
                        userId: user.id
                    },
                    data: {
                        devices: {
                            create: [{
                                good: {
                                    connect: {
                                        id: parseInt(goodId)
                                    }  
                                },
                                count: 1
                            }]
                        }
                    },
                }).then((basket) => {
                    res.status(200).json(basket)
                }).catch(err => {
                    res.status(400).json({ message: err.message })
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