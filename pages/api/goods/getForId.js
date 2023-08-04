import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    const {method} = req
    switch (method) {
        case 'POST':
            const { id } = req.body
            await prisma.good.findFirst({
                where: {
                    id: parseInt(id)
                },
                include: {
                    OldPrices: {
                        select: {
                            massDates: {
                                select: {
                                    price: true,
                                    createdAt: true,
                                    shop: true
                                }
                            }
                        }
                    }
                }
            }).then(data => {
                res.status(201).json(data)
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
}
}