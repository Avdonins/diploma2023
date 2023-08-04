export default async function handler(req, res) {
    const { data, loadedData } = req.body
    console.log(`DB: ${data.length}, loaded: ${loadedData.length}`)
    try {
        let isFind = false,
            nData = [],
            uData = [],
            dData = []
        
        data.map((item) => {
            isFind = false
            loadedData.map((newItem) => {
                if (newItem.name == item.name && newItem.description == item.description) {
                    isFind = true
                    if (newItem.price != item.price) {
                        uData.push(newItem)
                        uData.push(item)
                    }
                }
            })
            if (!isFind) {
                dData.push(item)
            }
        })

        loadedData.map((newItem) => {
            isFind = false
            data.map((item) => {
                if (newItem.name == item.name && newItem.description == item.description) {
                    isFind = true
                }
            })
            if (!isFind) {
                nData.push(newItem)
            }
        })
        return res.status(200).json({ nData, uData, dData })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        },
        responseLimit: false,
    }
}