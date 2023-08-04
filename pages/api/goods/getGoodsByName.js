import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    const {method} = req
    switch (method) {
        case 'POST':
            const { name } = req.body
            await prisma.good.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                }
            }).then(data => {
                res.status(200).json(data)
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