import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            const { username, password, new_password } = req.body
            await prisma.user.findFirst({
                where: {
                    username,
                }
            }).then(async (user) => {
                if (user.password == password){
                    await prisma.user.update({
                        where: {
                            username,
                        },
                        data: {
                            password: new_password,
                        }
                    })
                    res.status(200).json({
                        message: "Пароль успешно изменен"
                    })
                }
                else {
                    res.status(401).json({
                        message: "Неверный пароль"
                    })
                }
            }).catch(error => {
                res.status(400).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            break
    }
}