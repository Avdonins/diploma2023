import { prisma } from '../../../lib/prisma'

export default async function handler (req, res) {
    const categories = []
    try {
        const data = await prisma.good.findMany()
        data.map(item => {
            if (!categories.includes(item.category)) {
                categories.push(item.category)
            }
        })
        return res.status(200).json(categories)
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}