import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const types = [
        { libelle: 'Électricité', unite: 'kWh' },
        { libelle: 'Gaz', unite: 'm3' },
        { libelle: 'Eau', unite: 'Litre' },
    ]

    console.log('Start seeding...')

    for (const type of types) {
        const existing = await prisma.typeEnergie.findFirst({
            where: { libelle: type.libelle },
        })

        if (!existing) {
            const created = await prisma.typeEnergie.create({
                data: type,
            })
            console.log(`Created TypeEnergie: ${created.libelle}`)
        } else {
            console.log(`TypeEnergie already exists: ${existing.libelle}`)
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
