import prisma from '../src/prismaClient.js'

const TOTAL_DEVICES = 10
const RECORDINGS_PER_RUN = 12

async function generateTestData() {
    const startTime = Date.now()
    
    console.log('=== GENERARE DATE TEST ===')
    console.log(`Dispozitive: ${TOTAL_DEVICES}`)
    console.log(`Înregistrări per dispozitiv: ${RECORDINGS_PER_RUN}`)
    console.log(`Total înregistrări: ${TOTAL_DEVICES * RECORDINGS_PER_RUN}`)
    console.log('')
    
    // 1. Creează dispozitivele dacă nu există
    console.log('Verificare dispozitive...')
    const existingDevices = await prisma.device.findMany({
        select: { deviceId: true }
    })
    
    const existingIds = new Set(existingDevices.map(d => d.deviceId))
    const devicesToCreate = []
    
    for (let i = 2; i <= TOTAL_DEVICES + 1; i++) {
        const deviceId = `TEST-${i.toString().padStart(5, '0')}`
        if (!existingIds.has(deviceId)) {
            devicesToCreate.push({ deviceId })
        }
    }
    
    if (devicesToCreate.length > 0) {
        console.log(`Creare ${devicesToCreate.length} dispozitive...`)
        await prisma.device.createMany({
            data: devicesToCreate.map(d => ({
                ...d,
                claimSecret: 'test-secret'
            })),
            skipDuplicates: true
        })
        console.log(`✅ ${devicesToCreate.length} dispozitive create`)
    } else {
        console.log('✅ Toate dispozitivele există deja')
    }
    
    // 2. Generează înregistrări pentru toate dispozitivele
    console.log('')
    console.log('Generare înregistrări SensorReading...')
    
    const now = new Date()
    const baseTimestamp = new Date(Math.floor(now.getTime() / 300000) * 300000)
    
    const allRecordings = []
    
    for (let i = 2; i <= TOTAL_DEVICES + 1; i++) {
        const deviceId = `TEST-${i.toString().padStart(5, '0')}`
        
        for (let j = 0; j < RECORDINGS_PER_RUN; j++) {
            const timestamp = new Date(baseTimestamp.getTime() - (RECORDINGS_PER_RUN - 1 - j) * 300000)
            
            allRecordings.push({
                deviceId,
                timestamp,
                readingCount: RECORDINGS_PER_RUN,
                solarV: 12.5,
                solarA: 3.2,
                solarW: 40,
                gridV: 220,
                gridA: 1.5,
                gridW: 330,
                battV: 12.8,
                battA: 0.5,
                battW: 6.4,
                battTemp: 25,
                battSoc: 85,
                internalV: 5.0,
                internalA: 2.0,
                internalW: 10,
                externalV: 12.0,
                externalA: 1.0,
                externalW: 12,
                solarVMin: 12.0,
                solarVMax: 13.0,
                solarAMin: 3.0,
                solarAMax: 3.5,
                solarWMin: 36,
                solarWMax: 45,
                gridVMin: 218,
                gridVMax: 222,
                gridAMin: 1.4,
                gridAMax: 1.6,
                gridWMin: 310,
                gridWMax: 350,
                battVMin: 12.5,
                battVMax: 13.0,
                battAMin: 0.3,
                battAMax: 0.7,
                battWMin: 3.75,
                battWMax: 9.1,
                internalVMin: 4.9,
                internalVMax: 5.1,
                internalAMin: 1.9,
                internalAMax: 2.1,
                internalWMin: 9.31,
                internalWMax: 10.71,
                externalVMin: 11.8,
                externalVMax: 12.2,
                externalAMin: 0.9,
                externalAMax: 1.1,
                externalWMin: 10.62,
                externalWMax: 13.42,
                battState: 'charging',
                relay1: true,
                relay2: false,
                relay3: true,
                relay4: false
            })
        }
        
        if (i % 1000 === 0) {
            console.log(`Progres: ${i}/${TOTAL_DEVICES} dispozitive procesate`)
        }
    }
    
    console.log(`Inserare ${allRecordings.length} înregistrări...`)
    await prisma.sensorReading.createMany({
        data: allRecordings,
        skipDuplicates: true
    })
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log('')
    console.log(`✅ Date generate cu succes în ${duration}s`)
    console.log(`Total înregistrări în SensorReading: ${allRecordings.length}`)
    
    await prisma.$disconnect()
}

generateTestData().catch(err => {
    console.error('Eroare:', err)
    process.exit(1)
})
