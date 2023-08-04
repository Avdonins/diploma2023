import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
    const { method } = req
    const { func, item } = req.body
    let priceForMass = 0

    if(item.priceDiscount == null){
        priceForMass = item.price
    } else {
        priceForMass = item.priceDiscount
    }

    switch (method) {
        case 'POST':
            if (func == 'add') {
                console.log('add')
                await prisma.good.create({
                    data: {
                        img: item.img,
                        name: item.name,
                        description: item.description,
                        raiting: item.raiting,
                        price: item.price,
                        priceDiscount: item.priceDiscount,
                        url: item.url,
                        category: item.category,
                        shop: item.shop,
                        OldPrices: {
                            create: {
                                massDates: {
                                    create: {
                                        price: priceForMass,
                                        shop: item.shop
                                    }
                                }
                            }
                        }
                    }
                }).then(response => {
                    res.status(200).json(response)
                }).catch(error => {
                    res.status(500).json({
                        message: error.message
                    })
                })
            } else if (func == 'update') {
                await prisma.good.findFirst({
                    where: {
                        name: item.name,
                        description: item.description
                    }
                }).then(async data => {
                    await prisma.good.update({
                        where: {
                            id: data.id
                        },
                        data: {
                            price: item.price,
                            priceDiscount: item.priceDiscount,
                            OldPrices: {
                                update: {
                                    massDates: {
                                        create: {
                                            price: priceForMass
                                        }
                                    }
                                }
                            }
                        }
                    }).then(response => {
                        res.status(200).json(response)
                    }).catch(error => {
                        res.status(500).json({
                            message: `Ошибка при обновлении товара: ${error.message}`
                        })
                    })
                }).catch(error => {
                    res.status(500).json({
                        message: `Ошибка при поиске товара: ${error.message}`
                    })
                })
            }
            break
        case 'DELETE':
            res.status(200).json({
                message: 'Товар удален'
            })
            break
        default:
            res.setHeader('Allow', ['POST', 'DELETE'])
            break
    }
    // try {
    //     let data = {}
    //     if (!category) {
    //         data = await prisma.good.findMany()
    //     } else {
    //         data = await prisma.good.findMany({
    //             where: {
    //                 category: category
    //             },
    //             skip: skip,
    //             take: take
    //         })
    //     }
    //     return res.status(200).json(data)
    // } catch(error) {
    //     return res.status(500).json({
    //         message: error.message
    //     })
    // }
}