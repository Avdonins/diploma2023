import { prisma } from "../../lib/prisma";
import { goodsRepo } from "../../helpers/goods_update";

export default async function handler(req, res) {
    const { method } = req
    const { func, driver } = req.body
    let data = {}

    switch (method) {
        case 'POST':
            switch (func) {
                case 'updateData':
                    await goodsRepo.updateData(driver)
                    data = goodsRepo.getData()
                    res.status(200).json(data)
                    break
                case 'getData':
                    data = goodsRepo.getData()
                    res.status(200).json(data)
                    break
                case 'stopLoad':
                    goodsRepo.stopLoad()
                    res.status(200).json({success: true})
                    break
                case 'getDate':
                    const date = goodsRepo.getDate()
                    res.status(200).json(date)
                    break
            }
            break
        default:
            res.setHeader('Allow', ['GET'])
            break
    }
}

