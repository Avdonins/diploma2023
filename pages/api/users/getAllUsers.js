import { prisma } from '../../../lib/prisma'

export default async function handler (req, res) {
    try {
        const data = await prisma.user.findMany()
        return res.status(200).json(data)
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}