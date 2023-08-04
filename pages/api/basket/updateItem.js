import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    const { method } = req
    const { basketId, goodId, count } = req.body
    switch (method) {
        case 'POST':
            await prisma.basket_Device.findFirst({
                where: {
                    basketId,
                    goodId
                }
            }).then(async (basket_Device) => {
                if (count <= 0) {
                    await prisma.basket_Device.delete({
                        where: {
                            id: basket_Device.id
                        }
                    }).then((response) => {
                        res.status(200).json(response)
                    }).catch(err => {
                        res.status(400).json({ message: err.message })
                    })
                } else {
                    await prisma.basket_Device.update({
                        where: {
                            id: basket_Device.id
                        },
                        data: {
                            count
                        }
                    }).then((response) => {
                        res.status(200).json(response.data)
                    }).catch(err => {
                        res.status(400).json({ message: err.message })
                    })
                }
            }).catch(err => {
                res.status(400).json({ message: err.message })
            })
            break
        case 'DELETE':
            await prisma.basket_Device.findFirst({
                where: {
                    basketId,
                    goodId
                }
            }).then(async (basket_Device) => {
                await prisma.basket_Device.delete({
                    where: {
                        id: basket_Device.id
                    }
                }).then((response) => {
                    res.status(200).json(response)
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