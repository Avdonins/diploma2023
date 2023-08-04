import { prisma } from '../../../lib/prisma'

export default async function handler (req, res) {
    const {skip, take, category} = req.body
    
    try {
        let data = {}
        if (!category) {
            data = await prisma.good.findMany()
        } else {
            data = await prisma.good.findMany({
                where: {
                    category: category
                },
                skip: skip,
                take: take
            })
        }
        return res.status(200).json(data)
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}